const express = require('express');
const multer = require('multer');
const SftpClient = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // this parses the URL-encoded data
app.use(cors({
  origin: 'https://www.dizzyy.tech',
  methods: ['POST'],
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});


app.post('/upload', upload.single('rom'), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  const { ip, username, password, path: destinationPath } = req.body;

  const sftp = new SftpClient();
  try {
    await sftp.connect({
      host: ip,
      username,
      password,
    });

    const fullRemotePath = path.posix.join(destinationPath, fileName);
    await sftp.fastPut(filePath, fullRemotePath);
    res.send(`<h2>✅ ROM ${fileName} successfuly sent to ${username}@${ip}:${destinationPath}</h2><a href="/">Back</a>`);
  } catch (err) {
    console.error('Erreur SFTP : ' + err);
    res.status(500).send(`
      <h2>❌ Error sending ROM</h2>
      <pre>${err.stack}</pre>
      <a href="/">Back</a>
    `);
    
  } finally {
    await sftp.end();
    fs.unlinkSync(filePath); // delets the local file after upload
  }
});

app.listen(3000, () => {
  console.log('Upload Server on: http://localhost:3000');
});
