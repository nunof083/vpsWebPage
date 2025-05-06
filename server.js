const express = require('express');
const multer = require('multer');
const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
// const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // this parses the URL-encoded data
// app.use(cors({
//   origin: 'https://www.dizzyy.tech',
//   methods: ['POST'],
// }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});


app.post('/upload', upload.single('rom'), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;
  const { ip, username, password, path: destinationPath } = req.body;

  console.log(`📤 Upload requested to ${ip} as ${username}`);
  console.log(`📄 File: ${fileName} (saved as ${filePath})`);
  console.log(`📁 Destination path: ${destinationPath}`);

  const sftp = new SftpClient();
  try {
    await sftp.connect({
      host: ip,
      username,
      password,
    });

    console.log("🔐 SFTP connected.");

    const fullRemotePath = path.posix.join(destinationPath, fileName);
    console.log(`➡️ Uploading to: ${fullRemotePath}`);

    await sftp.fastPut(filePath, fullRemotePath);

    console.log("✅ Upload complete.");
    res.send(`<div style="color:green"><h2>✅ ROM ${fileName} sent to ${username}@${ip}:${destinationPath}</h2></div><a href="/">Back</a>`);
  } catch (err) {
    console.error('❌ SFTP upload failed:', err);
    res.status(500).send(`<div style="color:red"><h2>❌ Upload failed: ${err.message}</h2><pre>${err.stack}</pre></div><a href="/">Back</a>`);
  } finally {
    await sftp.end();
    fs.unlinkSync(filePath); // clean up
  }
});


app.listen(3001, () => {
  console.log('Upload Server on: http://localhost:3000');
});
