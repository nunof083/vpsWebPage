const form = document.getElementById('uploadForm');
      const overlay = document.getElementById('loadingOverlay');
      const note   = document.getElementById('notification');

      form.addEventListener('submit', async e => {
        e.preventDefault();
        note.className = 'hidden';
        overlay.className = '';

        const data = new FormData(form);
        try {
          const res = await fetch('/upload', { method: 'POST', body: data });
          const text = await res.text();
          overlay.className = 'hidden';
          note.innerHTML = res.ok
            ? `<div class="success">${text}</div>`
            : `<div class="error">${text}</div>`;
        } catch (err) {
          overlay.className = 'hidden';
          note.innerHTML = `<div class="error">❌ Network error</div>`;
        }
        note.classList.remove('hidden');
      });