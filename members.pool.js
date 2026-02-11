// members-pool.js
// Generates 722 diverse synthetic members (names, avatars, roles, verified, online, typing, joined)
// Exposes global window.MembersPool and window.MembersAPI
// - Admin: "Profit Hunters 🌐" with ./assets/admin.png
// - Mods: 6 seeded/remote avatars
// - Members: 722 total, deterministic avatars, varied names (full, handles, emoji, etc.)
// - Member verified percentage: ~8% (deterministic per id)

(function () {
  const TOTAL = 722;
  const ADMIN_COUNT = 1;
  const MOD_COUNT = 6;
  const MEMBER_COUNT = TOTAL - ADMIN_COUNT - MOD_COUNT;

  // --- name building blocks ---
  const firstNames = [ "Alex","Jamie","Chris","Taylor","Jordan","Casey","Morgan","Riley","Avery","Quinn",
    "Sam","Lee","Cameron","Dakota","Skyler","Peyton","Reese","Harley","Rowan","Logan",
    "Amina","Hana","Diego","Sven","Mateo","Lina","Yara","Hiro","Priya","Kofi",
    "Fatima","Ivan","Olga","Noah","Zoe","Mia","Eli","Ada","Nora","Kai",
    "Ola","Sora","Iman","Jin","Rosa","Musa","Nadia","Bora","Levi","Iris"
  ];
  const lastNames = [ "Smith","Johnson","Brown","Taylor","Anderson","Thomas","Jackson","White",
    "Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Lewis",
    "Nguyen","Patel","Singh","Wang","Khan","Müller","Silva","Moreau","Costa","Ito"
  ];

  const emojiPrefixes = ["🌟","🔥","💎","🚀","🦊","🐻","✨","⚡","🤖","🍀","🍣","🌙"];
  const cryptoPrefixes = ["0x","eth_","btc_","nft_","coin_","swap_"];
  const handleSuffixes = ["99","_x","_pro","_dev","_trader","HQ","_zen","_one","007","_io","_art"];

  // Local assets (kept small)
  const localIllustrations = [
    "./assets/avatars/illo1.png","./assets/avatars/illo2.png","./assets/avatars/illo3.png",
    "./assets/avatars/illo4.png","./assets/avatars/illo5.png"
  ];
  const funIcons = [
    "./assets/avatars/dice.png","./assets/avatars/bear.png","./assets/avatars/crypto1.png",
    "./assets/avatars/emoji_face.png","./assets/avatars/robot.png"
  ];
  const blanks = ["./assets/avatars/blank1.png","./assets/avatars/blank2.png"];
  const rare = ["./assets/avatars/rare1.png","./assets/avatars/rare2.png"];

  // Admin fixed avatar and name
  const ADMIN_NAME = "Profit Hunters 🌐";
  const ADMIN_AVATAR = "./assets/admin.png";

  // remote mod avatars (seeded/remote for realism)
  const modAvatars = [
    "https://api.dicebear.com/7.x/adventurer/svg?seed=mod-1",
    "https://picsum.photos/seed/mod-2/200/200",
    "https://randomuser.me/api/portraits/men/45.jpg",
    "https://robohash.org/mod-4.png?size=200x200",
    "https://avatars.githubusercontent.com/u/1027025?v=4",
    "https://api.dicebear.com/7.x/bottts/svg?seed=mod-6"
  ];

  // historic range
  const historicStart = new Date('2025-08-27T08:00:00Z').getTime();
  const now = Date.now();

  function randBetween(minTs, maxTs) {
    return new Date(minTs + Math.floor(Math.random() * (maxTs - minTs)));
  }

  // deterministic djb2-ish hash -> positive int
  function hashToInt(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) + str.charCodeAt(i);
      h = h & 0xffffffff;
    }
    return Math.abs(h);
  }

  // PICK AVATAR - deterministic weighted selection across many providers
  function pickAvatar(seed) {
    const s = (seed || Math.random().toString(36).slice(2)).toString();
    const hv = hashToInt(s);
    const r = hv % 100; // 0..99

    // 30% seeded photo-like (picsum / randomuser)
    if (r < 30) {
      const sub = hashToInt(s + "p") % 100;
      if (sub < 50) {
        return `https://picsum.photos/seed/${encodeURIComponent(s)}/200/200`;
      } else {
        const gender = (hashToInt(s + "g") % 2 === 0) ? "men" : "women";
        const id = (hashToInt(s + "n") % 99) + 1;
        return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`;
      }
    }

    // 40% DiceBear (many styles)
    if (r < 70) {
      const styles = ["adventurer","identicon","bottts","avataaars","pixel-art","thumbs","micah","open-peeps","big-smile"];
      const style = styles[hashToInt(s + "style") % styles.length];
      return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(s)}`;
    }

    // 15% RoboHash
    if (r < 85) {
      return `https://robohash.org/${encodeURIComponent(s)}.png?size=200x200`;
    }

    // 5% GitHub-like seeded id (larger range)
    if (r < 90) {
      const ghId = (hashToInt(s + "gh") % 10000) + 1; // 1..10000
      return `https://avatars.githubusercontent.com/u/${ghId}?v=4`;
    }

    // 5% local illustrations / fun icons
    if (r < 95) {
      const arr = localIllustrations.concat(funIcons);
      return arr[hashToInt(s + "local") % arr.length];
    }

    // 5% blanks/rare
    {
      const arr = blanks.concat(rare);
      return arr[hashToInt(s + "blank") % arr.length];
    }
  }

  // ------------------- improved makeUniqueName() -------------------
  const usedNames = new Set();

  function makeUniqueName() {
    let tries = 0;
    while (tries++ < 500) {
      const roll = Math.random();

      let name = "";

      // Distribution:
      // 45% full name, 20% crypto/handle, 12% emoji-prefixed/suffixed,
      // 8% lowercase single-word, 6% mixed-case, 4% ALL-CAPS, 3% initial+digits, 1% emoji-only
      if (roll < 0.45) {
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        name = `${first} ${last}`;
        if (Math.random() < 0.12) name += `${Math.floor(Math.random() * 90) + 10}`; // couple digits
      } else if (roll < 0.65) {
        const pref = Math.random() < 0.5 ? cryptoPrefixes[Math.floor(Math.random()*cryptoPrefixes.length)] : "";
        const core = firstNames[Math.floor(Math.random()*firstNames.length)];
        const coreForm = (Math.random() < 0.45)
          ? core.toLowerCase()
          : (Math.random() < 0.5 ? core.charAt(0).toUpperCase() + core.slice(1) : core.toUpperCase());
        const sep = Math.random() < 0.3 ? "_" : (Math.random() < 0.15 ? "." : "");
        const suf = Math.random() < 0.55 ? handleSuffixes[Math.floor(Math.random()*handleSuffixes.length)] : "";
        name = `${pref}${coreForm}${sep}${suf}`.replace(/(^_+|_+$|\.+$)/g,"");
        if (Math.random() < 0.06) name += emojiPrefixes[Math.floor(Math.random()*emojiPrefixes.length)];
      } else if (roll < 0.77) {
        const emoji = emojiPrefixes[Math.floor(Math.random()*emojiPrefixes.length)];
        const word = firstNames[Math.floor(Math.random()*firstNames.length)];
        name = Math.random() < 0.5 ? `${emoji}${word}` : `${word}${emoji}`;
        if (Math.random() < 0.35) name = name.replace(/[A-Za-z]+/, m => m.toLowerCase());
      } else if (roll < 0.85) {
        const word = firstNames[Math.floor(Math.random()*firstNames.length)].toLowerCase();
        name = Math.random() < 0.18 ? `${word}${Math.floor(Math.random()*99)}` : word;
      } else if (roll < 0.91) {
        const core = firstNames[Math.floor(Math.random()*firstNames.length)];
        const tail = Math.random() < 0.6 ? handleSuffixes[Math.floor(Math.random()*handleSuffixes.length)] : "";
        const mixed = core.charAt(0).toUpperCase() + core.slice(1);
        name = `${mixed}${tail}`;
        if (Math.random() < 0.35) name = name.split('').map((c,i)=> i%2?c.toLowerCase():c).join('');
      } else if (roll < 0.95) {
        const core = firstNames[Math.floor(Math.random()*firstNames.length)].slice(0,6).toUpperCase();
        name = `${core}${Math.floor(Math.random()*90) + 10}`;
      } else if (roll < 0.98) {
        const init = firstNames[Math.floor(Math.random()*firstNames.length)][0].toLowerCase();
        name = `${init}${Math.floor(10 + Math.random()*990)}`;
      } else {
        const e1 = emojiPrefixes[Math.floor(Math.random()*emojiPrefixes.length)];
        const e2 = emojiPrefixes[Math.floor(Math.random()*emojiPrefixes.length)];
        name = `${e1}${e2}`;
      }

      name = name.trim().replace(/\s+/g,' ').replace(/(^[^A-Za-z0-9🌟🔥💎🚀🦊🐻✨⚡🤖🍀🍣🌙]+|[^A-Za-z0-9🌟🔥💎🚀🦊🐻✨⚡🤖🍀🍣🌙]+$)/g, '');

      if (!usedNames.has(name) && name.length > 0) {
        usedNames.add(name);
        return name;
      }
    }

    // fallback
    let fallback;
    do {
      fallback = `member${Math.floor(100000 + Math.random() * 900000)}`;
    } while (usedNames.has(fallback));
    usedNames.add(fallback);
    return fallback;
  }

  // ------------------- pool build with avatar uniqueness logic -------------------
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pool = [];
  const usedAvatars = new Set();

  // register admin & mod avatars
  if (ADMIN_AVATAR) usedAvatars.add(ADMIN_AVATAR);
  modAvatars.forEach(a => { if (a) usedAvatars.add(a); });

  // 1) Admin
  for (let i = 0; i < ADMIN_COUNT; i++) {
    pool.push({
      id: `admin-${i+1}`,
      name: ADMIN_NAME,
      avatar: ADMIN_AVATAR,
      role: "admin",
      verified: true,
      online: true,
      typing: false,
      joined: randBetween(historicStart, now).getTime()
    });
  }

  // 2) Mods
  for (let m = 0; m < MOD_COUNT; m++) {
    const seed = `mod-${m+1}`;
    let avatar = modAvatars[m % modAvatars.length] || pickAvatar(seed);
    if (!usedAvatars.has(avatar)) usedAvatars.add(avatar);
    else {
      const alt = pickAvatar(seed + "-alt");
      avatar = usedAvatars.has(alt) ? avatar : alt;
      usedAvatars.add(avatar);
    }
    pool.push({
      id: seed,
      name: makeUniqueName(),
      avatar,
      role: "mod",
      verified: true,
      online: (hashToInt(seed + "-online") % 100) / 100 < 0.85,
      typing: false,
      joined: randBetween(historicStart, now).getTime()
    });
  }

  // 3) Members (12 tries to avoid avatar duplicates)
  for (let i = 0; i < MEMBER_COUNT; i++) {
    const id = `member-${i+1}`;
    const noAvatar = (hashToInt(id + "-na") % 100) / 100 < 0.10; // ~10% no avatar
    let avatar = null;
    if (!noAvatar) {
      let tries = 0;
      let candidate = null;
      while (tries++ < 12) {
        candidate = pickAvatar(id + "-" + tries);
        if (!usedAvatars.has(candidate)) { avatar = candidate; usedAvatars.add(candidate); break; }
      }
      if (!avatar) { avatar = candidate || pickAvatar(id + "-fallback"); usedAvatars.add(avatar); }
    }

    // member verified deterministic ~8%
    const verified = ((hashToInt(id + "-ver") % 100) / 100) < 0.08; // ~8% verified for members

    pool.push({
      id,
      name: makeUniqueName(),
      avatar: avatar, // may be null
      role: "member",
      verified: verified,
      online: (hashToInt(id + "-online") % 100) / 100 < 0.65,
      typing: false,
      country: null,
      joined: randBetween(historicStart, now).getTime()
    });
  }

  // final shuffle: keep admin+mods at front, shuffle members
  const adminPart = pool.slice(0, ADMIN_COUNT + MOD_COUNT);
  const membersPart = pool.slice(ADMIN_COUNT + MOD_COUNT);
  shuffle(membersPart);
  const finalPool = adminPart.concat(membersPart);

  // expose API
  window.MembersPool = finalPool;

  window.MembersAPI = {
    all() { return window.MembersPool.slice(); },
    byRole(role) { return window.MembersPool.filter(m => m.role === role); },
    find(id) { return window.MembersPool.find(m => m.id === id); },
    randomOnline(n = 1) {
      const online = window.MembersPool.filter(m => m.online);
      if (online.length === 0) return [];
      if (n >= online.length) return shuffle(online.slice());
      const out = [];
      const copy = online.slice();
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
      }
      return out;
    },
    markTyping(id, flag = true) { const m = window.MembersPool.find(x => x.id === id); if (m) m.typing = !!flag; return m; },
    setOnline(id, flag = true) { const m = window.MembersPool.find(x => x.id === id); if (m) { m.online = !!flag; m.lastActive = Date.now(); } return m; },
    setAvatar(id, avatarUrl) { const m = window.MembersPool.find(x => x.id === id); if (m) m.avatar = avatarUrl; return m; },
    getCounts() { const online = window.MembersPool.filter(m => m.online).length; const verified = window.MembersPool.filter(m => m.verified).length; const typing = window.MembersPool.filter(m => m.typing).map(m => m.name); return { total: window.MembersPool.length, online, verified, typing }; }
  };

  console.log(`MembersPool generated: total=${window.MembersPool.length} (admin=${ADMIN_COUNT}, mods=${MOD_COUNT}, members=${MEMBER_COUNT})`);
  console.log('Sample members:', window.MembersPool.slice(0, 12).map(p => ({ id: p.id, name: p.name, avatar: p.avatar ? p.avatar : '(no avatar)', verified: p.verified })));
})();
