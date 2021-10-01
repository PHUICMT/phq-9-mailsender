const express = require("express");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios").default;

const app = express();
const upload = multer();

app.use(express.json());

app.post("/node-video-uploads", upload.single("webcam"), async function (
  req,
  res
) {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ message: "Can't upload" });
  } else {
    await writeFile(req.file).then(async () => {
      res.status(200).json({ message: "success" });
      await postVideo(req.file).then(async (fromBackend) => {
        console.log(fromBackend);
        await removeFile(req.file.originalname);
      });
    });
  }
});

app.listen(9000, () => {
  console.log("Mail Sender Started!! 9000");
});

function writeFile(file) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file.originalname, file.buffer, function (error) {
      if (error) reject(error);
      console.log("file received");
    });
    resolve("file created successfully with handcrafted Promise!");
  });
}

function removeFile(originalname) {
  return new Promise((resolve, reject) => {
    fs.unlink(originalname, (error) => {
      if (error) reject(error);
    });
    resolve("file removed successfully!");
  });
}

async function postVideo(file) {
  var data = new FormData();
  data.append("fileName", file.originalname);
  data.append("buffer", file.buffer);
  data.append("file", fs.createReadStream(`./${file.originalname}`));

  const res = await axios
    .post("/process-video", data, {
      headers: data.getHeaders(),
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  return res;
}
