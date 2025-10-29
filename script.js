// script.js - Dengan dukungan Salin sebagai JSON (key dalam bahasa Inggris)

document.addEventListener('DOMContentLoaded', () => {
  const objekModeSelect = document.getElementById('objek-mode');
  const objekCustomInput = document.getElementById('objek-custom');
  const teksStickerInput = document.getElementById('teks-sticker');
  const fontGroup = document.getElementById('font-group');
  const generateBtn = document.getElementById('generate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const copyJsonBtn = document.getElementById('copy-json-btn');
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

  // Generate prompt
  generateBtn.addEventListener('click', () => {
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
      bagianObjek = 'Use the face from the attached photo as the main reference.';
    } else {
      if (!objekCustom) {
        alert('Harap isi deskripsi objek!');
        return;
      }
      bagianObjek = objekCustom;
    }

    let bagianTeks = '';
    if (teks) {
      bagianTeks = ` Include the text: "${teks}" in ${gayaFont} font style.`;
    }

    const prompt = `Create a digital sticker illustration in ${gayaSticker} style of ${bagianObjek}, in a ${pose} pose, with a ${ekspresi} expression.${bagianTeks} Background: ${latar}. Design must be clean, recognizable, and optimized for use as a chat sticker.`;

    hasilPrompt.value = prompt;
  });

  // Salin teks biasa
  copyBtn.addEventListener('click', () => {
    if (!hasilPrompt.value) {
      alert('Belum ada prompt untuk disalin!');
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

  // Salin sebagai JSON (dalam bahasa Inggris)
  copyJsonBtn.addEventListener('click', () => {
    if (!hasilPrompt.value) {
      alert('Harap buat prompt terlebih dahulu!');
      return;
    }

    const objekMode = objekModeSelect.value;
    const objekCustom = objekCustomInput.value.trim();
    const pose = document.getElementById('pose').value;
    const ekspresi = document.getElementById('ekspresi').value;
    const teks = teksStickerInput.value.trim();
    const gayaFont = document.getElementById('gaya-font').value;
    const gayaSticker = document.getElementById('gaya-sticker').value;
    const latar = document.getElementById('latar-belakang').value.trim() || 'transparan';

    const jsonData = {
      prompt_type: "sticker",
      created_by: "BANG LATEP",
      subject: objekMode === 'foto' 
        ? 'Use the face from the attached photo as the main reference.' 
        : objekCustom,
      pose: pose,
      expression: ekspresi,
      text: teks || null,
      font_style: teks ? gayaFont : null,
      sticker_style: gayaSticker,
      background: latar,
      prompt: hasilPrompt.value
    };

    const jsonStr = JSON.stringify(jsonData, null, 2);

    // Gunakan Clipboard API modern
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(jsonStr).then(() => {
        const btn = copyJsonBtn;
        const originalText = btn.textContent;
        btn.textContent = 'Tersalin JSON!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }).catch(() => {
        fallbackCopyTextToClipboard(jsonStr, copyJsonBtn);
      });
    } else {
      fallbackCopyTextToClipboard(jsonStr, copyJsonBtn);
    }
  });

  // Fallback untuk browser lama
  function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const success = document.execCommand('copy');
      if (success) {
        const originalText = button.textContent;
        button.textContent = 'Tersalin JSON!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 1500);
      }
    } catch (err) {
      alert('Gagal menyalin JSON. Coba salin manual.');
    }
    document.body.removeChild(textArea);
  }
});
