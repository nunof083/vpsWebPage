document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
  
    const loadingOverlay = document.getElementById('loadingOverlay');
    const notification = document.getElementById('notification');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
  
    notification.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
  
    xhr.open('POST', '/upload', true);
  
    xhr.upload.addEventListener('progress', function (e) {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percent + '%';
        progressPercent.textContent = percent + '%';
      }
    });
  
    xhr.onload = function () {
      loadingOverlay.classList.add('hidden');
      if (xhr.status === 200) {
        notification.innerHTML = `<div class="success">${xhr.responseText}</div>`;
      } else {
        notification.innerHTML = `<div class="error">Upload failed: ${xhr.statusText}</div>`;
      }
      notification.classList.remove('hidden');
    };
  
    xhr.onerror = function () {
      loadingOverlay.classList.add('hidden');
      notification.innerHTML = `<div class="error">Network error occurred during upload.</div>`;
      notification.classList.remove('hidden');
    };
  
    xhr.send(formData);
  });
  