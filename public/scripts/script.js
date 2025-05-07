document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const form = e.target;
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
  
    const loadingOverlay = document.getElementById('loadingOverlay');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const notification = document.getElementById('notification');
    const loadingText = document.getElementById('loadingText');
  
    notification.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    loadingText.textContent = 'Uploading…';
  
    xhr.open('POST', '/upload', true);
  
    xhr.upload.addEventListener('progress', function (e) {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percent + '%';
        progressPercent.textContent = percent + '%';
  
        if (percent >= 100) {
          loadingText.textContent = 'Upload complete – waiting for server…';
        }
      }
    });
  
    xhr.onload = function () {
      loadingOverlay.classList.add('hidden');
      progressContainer.classList.add('hidden');
  
      if (xhr.status === 200) {
        notification.innerHTML = `<div class="success">${xhr.responseText}</div>`;
      } else {
        notification.innerHTML = `<div class="error">Upload failed: ${xhr.statusText}</div>`;
      }
      notification.classList.remove('hidden');
    };
  
    xhr.onerror = function () {
      loadingOverlay.classList.add('hidden');
      progressContainer.classList.add('hidden');
  
      notification.innerHTML = `<div class="error">Network error occurred during upload.</div>`;
      notification.classList.remove('hidden');
    };
  
    xhr.send(formData);
  });
  