// script.js - Mode Dual: Create Prompt & Create JSON

document.addEventListener('DOMContentLoaded', () => {
  const objekModeSelect = document.getElementById('objek-mode');
  const objekCustomInput = document.getElementById('objek-custom');
  const teksStickerInput = document.getElementById('teks-sticker');
  const fontGroup = document.getElementById('font-group');
  const createPromptBtn = document.getElementById('create-prompt-btn');
  const createJsonBtn = document.getElementById('create-json-btn');
  const copyBtn = document.getElementById('copy-btn');
  const hasilPrompt = document.getElementById('hasil-prompt');

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

  // Variabel untuk menyimpan mode terakhir
  let currentMode = 'prompt'; // 'prompt' atau 'json'

  // Fungsi generate prompt (bahasa Indonesia)
  function generatePrompt() {
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const pose = document.getElementById('pose').value;
    const ekspresi = document.getElementById('ekspresi').value;
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';

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

    let bagianTeks = '';
    if (teks) {
      bagianTeks = ` Sertakan teks: "${teks}" dengan gaya font ${gayaFont}.`;
    }

    return `Buatkan ilustrasi digital sticker bergaya ${gayaSticker} dari ${bagianObjek}, dalam pose ${pose}, dengan ekspresi ${ekspresi}.${bagianTeks} Latar belakang: ${latar}. Desain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;
  }

  // Fungsi generate JSON (key Inggris, value Indo)
  function generateJson() {
    const promptText = generatePrompt();
    if (!promptText) return null;

    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const pose = document.getElementById('pose').value;
    const ekspresi = document.getElementById('ekspresi').value;
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';

    return {
      prompt_type: "sticker",
      created_by: "BANG LATEP",
      subject: objekMode === 'foto' 
        ? 'Gunakan wajah dari foto yang dilampirkan sebagai referensi utama.' 
        : objekCustom,
      pose: pose,
      expression: ekspresi,
      text: teks || null,
      font_style: teks ? gayaFont : null,
      sticker_style: gayaSticker,
      background: latar,
      prompt: promptText
    };
  }

  // Tombol Create Prompt
  createPromptBtn.addEventListener('click', () => {
    currentMode = 'prompt';
    const prompt = generatePrompt();
    if (prompt) {
      hasilPrompt.value = prompt;
      copyBtn.textContent = 'SALIN PROMPT';
    }
  });

  // Tombol Create JSON
  createJsonBtn.addEventListener('click', () => {
    currentMode = 'json';
    const json = generateJson();
    if (json) {
      hasilPrompt.value = JSON.stringify(json, null, 2);
      copyBtn.textContent = 'SALIN JSON';
    }
  });

  // Tombol Salin (hanya satu)
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
