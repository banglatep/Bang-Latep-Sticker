// script.js - Dual Mode + Batch Generate + JSON Minimalis

document.addEventListener('DOMContentLoaded', () => {
  const objekModeSelect = document.getElementById('objek-mode');
  const objekCustomInput = document.getElementById('objek-custom');
  const teksStickerInput = document.getElementById('teks-sticker');
  const fontGroup = document.getElementById('font-group');
  const createPromptBtn = document.getElementById('create-prompt-btn');
  const createJsonBtn = document.getElementById('create-json-btn');
  const copyBtn = document.getElementById('copy-btn');
  const hasilPrompt = document.getElementById('hasil-prompt');
  const jumlahInput = document.getElementById('jumlah-sticker');

  // Toggle input custom objek
  objekModeSelect.addEventListener('change', () => {
    if (objekModeSelect.value === 'custom') {
      objekCustomInput.style.display = 'block';
    } else {
      objekCustomInput.style.display = 'none';
    }
  });

  // Sembunyikan font group jika teks kosong
  teksStickerInput.addEventListener('input', () => {
    if (teksStickerInput.value.trim() === '') {
      fontGroup.style.display = 'none';
    } else {
      fontGroup.style.display = 'block';
    }
  });

  // Fungsi acak array
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Ambil semua opsi pose & ekspresi
  const semuaPose = Array.from(document.getElementById('pose').options).map(opt => opt.value);
  const semuaEkspresi = Array.from(document.getElementById('ekspresi').options).map(opt => opt.value);

  // Generate prompt teks (batch atau tunggal)
  function generatePromptText() {
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const jumlah = parseInt(jumlahInput.value) || 1;

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

    // Jika hanya 1 sticker
    if (jumlah === 1) {
      const pose = document.getElementById('pose').value;
      const ekspresi = document.getElementById('ekspresi').value;
      let bagianTeks = '';
      if (teks) {
        bagianTeks = ` Sertakan teks: "${teks}" dengan gaya font ${gayaFont}.`;
      }
      return `Buatkan ilustrasi digital sticker bergaya ${gayaSticker} dari ${bagianObjek}, dalam pose ${pose}, dengan ekspresi ${ekspresi}.${bagianTeks} Latar belakang: ${latar}. Desain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;
    }

    // Jika lebih dari 1 → acak pose & ekspresi
    const poseDipilih = shuffle(semuaPose).slice(0, jumlah);
    const ekspresiDipilih = shuffle(semuaEkspresi).slice(0, jumlah);

    let daftar = '';
    for (let i = 0; i < jumlah; i++) {
      const p = poseDipilih[i % poseDipilih.length];
      const e = ekspresiDipilih[i % ekspresiDipilih.length];
      daftar += `\n- Sticker ${i + 1}: pose ${p}, ekspresi ${e}`;
    }

    let bagianTeks = '';
    if (teks) {
      bagianTeks = ` Sertakan teks "${teks}" dengan gaya font ${gayaFont} di setiap sticker.`;
    }

    return `Buatkan ${jumlah} sticker dengan gaya ${gayaSticker} dari ${bagianObjek}.${bagianTeks} Latar belakang: ${latar}. Setiap sticker harus memiliki pose dan ekspresi berbeda:${daftar}\n\nDesain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;
  }

  // Generate JSON minimalis (hanya parameter inti)
  function generateJsonMinimal() {
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const jumlah = parseInt(jumlahInput.value) || 1;

    let bagianObjek;
    if (objekMode === 'foto') {
      bagianObjek = 'Gunakan wajah dari foto yang dilampirkan sebagai referensi utama.';
    } else {
      if (!objekCustom) return null;
      bagianObjek = objekCustom;
    }

    const json = {
      subject: bagianObjek,
      sticker_style: gayaSticker,
      background: latar,
      text: teks || null,
      font_style: teks ? gayaFont : null
    };

    if (jumlah === 1) {
      json.pose = document.getElementById('pose').value;
      json.expression = document.getElementById('ekspresi').value;
    } else {
      const poseDipilih = shuffle(semuaPose).slice(0, jumlah);
      const ekspresiDipilih = shuffle(semuaEkspresi).slice(0, jumlah);
      json.variations = [];
      for (let i = 0; i < jumlah; i++) {
        json.variations.push({
          pose: poseDipilih[i % poseDipilih.length],
          expression: ekspresiDipilih[i % ekspresiDipilih.length]
        });
      }
    }

    return json;
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
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      }
    } catch (err) {
      alert('Gagal menyalin.');
    }
  });
});
