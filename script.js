// script.js - Input Dinamis + Dual Mode + JSON Minimalis

document.addEventListener('DOMContentLoaded', () => {
  // Elemen UI
  const objekModeSelect = document.getElementById('objek-mode');
  const objekCustomInput = document.getElementById('objek-custom');
  const fontGroup = document.getElementById('font-group');
  const jumlahInput = document.getElementById('jumlah-sticker');
  const teksContainer = document.getElementById('teks-container');
  const poseContainer = document.getElementById('pose-container');
  const ekspresiContainer = document.getElementById('ekspresi-container');
  const createPromptBtn = document.getElementById('create-prompt-btn');
  const createJsonBtn = document.getElementById('create-json-btn');
  const copyBtn = document.getElementById('copy-btn');
  const hasilPrompt = document.getElementById('hasil-prompt');

  // Data opsi
  const POSE_OPTIONS = [
    "Angkat Jempol (Thumbs Up)",
    "Tangan di Dagu (Thinking Pose)",
    "Namaste / Tangan Menyatu di Dada",
    "Tangan Silang di Dada",
    "Tertawa Sambil Pegang Perut",
    "Membentuk Hati dengan Jari (Finger Heart / Heart Hands)",
    "Menunjuk ke Depan (Pointing Pose)",
    "Tangan di Mulut (Kaget / OMG Pose)",
    "Pamer Otot atau Pose Heroik",
    "Tangan Terbuka / Shrug Pose"
  ];

  const EKSPRESI_OPTIONS = [
    "Tersenyum Lebar / Happy",
    "Tertawa Sampai Mata Merem / Ngakak",
    "Mata Berbinar / Love Eyes",
    "Marah / Cemberut / Ngamuk Lucu",
    "Sedih / Menangis Dramatik",
    "Senyum Nakal / Smirk",
    "Kaget / Shock / Wah!",
    "Datar / Bete / Deadpan",
    "Mikir Serius / Mencurigai",
    "Ekspresi Senang Berlebihan / Party Mood"
  ];

  // Toggle input custom objek
  objekModeSelect.addEventListener('change', () => {
    objekCustomInput.style.display = objekModeSelect.value === 'custom' ? 'block' : 'none';
  });

  // Generate dropdown
  function createSelect(options, className, value = options[0]) {
    const select = document.createElement('select');
    select.className = className;
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === value) option.selected = true;
      select.appendChild(option);
    });
    return select;
  }

  // Generate input dinamis
  function generateInputs(jumlah) {
    teksContainer.innerHTML = '';
    poseContainer.innerHTML = '';
    ekspresiContainer.innerHTML = '';

    for (let i = 0; i < jumlah; i++) {
      // Teks
      const teksInput = document.createElement('input');
      teksInput.type = 'text';
      teksInput.className = 'teks-item';
      teksInput.placeholder = `Teks untuk sticker ${i + 1}`;
      teksContainer.appendChild(teksInput);

      // Pose
      poseContainer.appendChild(createSelect(POSE_OPTIONS, 'pose-item'));

      // Ekspresi
      ekspresiContainer.appendChild(createSelect(EKSPRESI_OPTIONS, 'ekspresi-item'));
    }

    // Kontrol tampil font group
    const hasTeks = jumlah > 0;
    fontGroup.style.display = hasTeks ? 'block' : 'none';
  }

  // Inisialisasi awal
  generateInputs(1);

  // Saat jumlah berubah
  jumlahInput.addEventListener('input', () => {
    let jumlah = parseInt(jumlahInput.value) || 1;
    jumlah = Math.max(1, Math.min(10, jumlah));
    jumlahInput.value = jumlah;
    generateInputs(jumlah);
  });

  // Baca data input
  function getStickerData() {
    const teksItems = Array.from(document.querySelectorAll('.teks-item')).map(el => el.value.trim());
    const poseItems = Array.from(document.querySelectorAll('.pose-item')).map(el => el.value);
    const ekspresiItems = Array.from(document.querySelectorAll('.ekspresi-item')).map(el => el.value);
    return { teksItems, poseItems, ekspresiItems };
  }

  // Generate prompt teks
  function generatePromptText() {
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';
    const gayaFont = document.getElementById('gaya-font').value;
    const { teksItems, poseItems, ekspresiItems } = getStickerData();
    const jumlah = teksItems.length;

    let bagianObjek;
    if (objekMode === 'foto') {
      bagianObjek = 'Gunakan wajah dari foto yang dilampirkan sebagai referensi utama.';
    } else {
      if (!objekCustom) {
        alert('Harap isi deskripsi objek!');
        return null;
      }
      bagianObjek = objekCustom;
    }

    if (jumlah === 1) {
      const teks = teksItems[0];
      let bagianTeks = '';
      if (teks) {
        bagianTeks = ` Sertakan teks: "${teks}" dengan gaya font ${gayaFont}.`;
      }
      return `Buatkan ilustrasi digital sticker bergaya ${gayaSticker} dari ${bagianObjek}, dalam pose ${poseItems[0]}, dengan ekspresi ${ekspresiItems[0]}.${bagianTeks} Latar belakang: ${latar}. Desain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;
    }

    let daftar = '';
    for (let i = 0; i < jumlah; i++) {
      const teks = teksItems[i];
      const teksPart = teks ? ` (teks: "${teks}")` : '';
      daftar += `\n- Sticker ${i + 1}: pose ${poseItems[i]}, ekspresi ${ekspresiItems[i]}${teksPart}`;
    }

    return `Buatkan ${jumlah} sticker dengan gaya ${gayaSticker} dari ${bagianObjek}. Latar belakang: ${latar}. Setiap sticker memiliki pose, ekspresi, dan teks berbeda:${daftar}\n\nDesain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;
  }

  // Generate JSON minimalis
  function generateJsonMinimal() {
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';
    const gayaFont = document.getElementById('gaya-font').value;
    const { teksItems, poseItems, ekspresiItems } = getStickerData();
    const jumlah = teksItems.length;

    let bagianObjek;
    if (objekMode === 'foto') {
      bagianObjek = 'Gunakan wajah dari foto yang dilampirkan sebagai referensi utama.';
    } else {
      if (!objekCustom) return null;
      bagianObjek = objekCustom;
    }

    if (jumlah === 1) {
      return {
        subject: bagianObjek,
        pose: poseItems[0],
        expression: ekspresiItems[0],
        text: teksItems[0] || null,
        font_style: teksItems[0] ? gayaFont : null,
        sticker_style: gayaSticker,
        background: latar
      };
    }

    const stickers = [];
    for (let i = 0; i < jumlah; i++) {
      stickers.push({
        pose: poseItems[i],
        expression: ekspresiItems[i],
        text: teksItems[i] || null
      });
    }

    return {
      subject: bagianObjek,
      sticker_style: gayaSticker,
      background: latar,
      font_style: teksItems.some(t => t) ? gayaFont : null,
      stickers: stickers
    };
  }

  // Tombol Create Prompt
  createPromptBtn.addEventListener('click', () => {
    const prompt = generatePromptText();
    if (prompt) {
      hasilPrompt.value = prompt;
      copyBtn.textContent = 'SALIN PROMPT';
    }
  });

  // Tombol Create JSON
  createJsonBtn.addEventListener('click', () => {
    const json = generateJsonMinimal();
    if (json) {
      hasilPrompt.value = JSON.stringify(json, null, 2);
      copyBtn.textContent = 'SALIN JSON';
    }
  });

  // Tombol Salin
  copyBtn.addEventListener('click', () => {
    if (!hasilPrompt.value) {
      alert('Belum ada hasil untuk disalin!');
      return;
    }
    hasilPrompt.select();
    hasilPrompt.setSelectionRange(0, 99999);
    try {
      const success = document.execCommand('copy');
      if (success) {
        const original = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => copyBtn.textContent = original, 1500);
      }
    } catch (e) {
      alert('Gagal menyalin.');
    }
  });
});
