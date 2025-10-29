// script.js

document.addEventListener('DOMContentLoaded', () => {
  const objekModeSelect = document.getElementById('objek-mode');
  const objekCustomInput = document.getElementById('objek-custom');
  const teksStickerInput = document.getElementById('teks-sticker');
  const fontGroup = document.getElementById('font-group');
  const generateBtn = document.getElementById('generate-btn');
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

  // Opsional: sembunyikan font group jika teks kosong (non-wajib, tapi rapi)
  teksStickerInput.addEventListener('input', () => {
    if (teksStickerInput.value.trim() === '') {
      fontGroup.style.display = 'none';
    } else {
      fontGroup.style.display = 'block';
    }
  });

  // Generate prompt
  generateBtn.addEventListener('click', () => {
    // Ambil nilai
    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const pose = document.getElementById('pose').value;
    const ekspresi = document.getElementById('ekspresi').value;
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';

    // Bangun bagian objek
    let bagianObjek;
    if (objekMode === 'foto') {
      bagianObjek = 'Gunakan wajah dari foto yang dilampirkan sebagai referensi utama.';
    } else {
      if (!objekCustom) {
        alert('Harap isi deskripsi objek!');
        return;
      }
      bagianObjek = objekCustom;
    }

    // Bangun bagian teks (jika ada)
    let bagianTeks = '';
    if (teks) {
      bagianTeks = ` Sertakan teks: "${teks}" dengan gaya font ${gayaFont}.`;
    }

    // Gabungkan prompt
    const prompt = `Buatkan ilustrasi digital sticker bergaya ${gayaSticker} dari ${bagianObjek}, dalam pose ${pose}, dengan ekspresi ${ekspresi}.${bagianTeks} Latar belakang: ${latar}. Desain harus bersih, mudah dikenali, dan optimal untuk digunakan sebagai sticker di aplikasi chat.`;

    // Tampilkan
    hasilPrompt.value = prompt;
  });

  // Salin ke clipboard
  copyBtn.addEventListener('click', () => {
    if (!hasilPrompt.value) {
      alert('Belum ada prompt untuk disalin!');
      return;
    }

    hasilPrompt.select();
    hasilPrompt.setSelectionRange(0, 99999); // Untuk mobile

    try {
      const success = document.execCommand('copy');
      if (success) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      } else {
        alert('Gagal menyalin. Coba manual (select + copy).');
      }
    } catch (err) {
      alert('Browser tidak mendukung fitur salin otomatis.');
    }
  });
});
