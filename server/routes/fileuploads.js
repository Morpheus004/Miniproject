import express from "express";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsDir);
  },
});

const uploadStorage = multer({ storage: storage });

router.post("/upload/single", uploadStorage.single("file"), (req, res) => {
  const file = req.file;
  console.log(file);
  if (!file) {
    return res.status(400).send({ status: "err", error: "No file uploaded" });
  }

  const uid = req.body.uid; // Access the uid from the parsed req.body
  const extension = path.extname(file.originalname);
  console.log(extension);
  const newFilename = `${uid}_Resume${extension}`;
  console.log(newFilename);
  const newFilePath = path.join(__dirname, '..', 'uploads', newFilename);

  // Rename the uploaded file with the new filename
  fs.rename(file.path, newFilePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: "err", error: "Error renaming file" });
    }

    res.send({ status: "success", message: `${file.originalname} uploaded!` });
  });
});


router.get('/download/:uid', (req, res) => {
  const uid = req.params.uid;
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  // Read the uploads directory and find the file with the matching uid
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    const fileToDownload = files.find(file => file.startsWith(`${uid}_`));

    if (!fileToDownload) {
      return res.status(404).send('File not found');
    }

    const filePath = path.join(uploadsDir, fileToDownload);
    const fileStream = fs.createReadStream(filePath);
    res.setHeader('Content-Type', 'application/octet-stream'); // Set the appropriate Content-Type header
    res.setHeader('Content-Disposition', `attachment; filename="${fileToDownload}"`);
    fileStream.pipe(res);
  });
});

router.get('/check-file/:uid', (req, res) => {
  // console.log(req);
  const uid = req.params.uid;
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  // Read the uploads directory and find the file with the matching uid
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    const fileWithUid = files.find(file => file.startsWith(`${uid}_`));

    if (!fileWithUid) {
      return res.json({ fileExists: false, file: null });
    }

    const filePath = path.join(uploadsDir, fileWithUid);
    const file = {
      name: fileWithUid,
      path: filePath,
    };

    res.json({ fileExists: true, file });
  });
});
export default router;
