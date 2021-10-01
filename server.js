const express = require("express");
const multer = require("multer");
// const FormData = require("form-data");
const axios = require("axios").default;
var _ = require("lodash");

const app = express();
// const upload = multer();

app.use(express.json());

app.post("/select-to-process", function (req, res) {
  if (!req.body) {
    console.log("No file received");
    return res.status(400).json({ message: "Can't Accept" });
  } else {
    console.log(req.body.uuid);
    console.log(req.body.to_email);
    var json = JSON.stringify(req.body);
    console.log(json);
    var jsonFromBackend = postVideoToProcess(json);
    var backendAccepted = _.isEqual(json, jsonFromBackend);
    if (backendAccepted) {
      return res.status(200);
    }
    return res.status(400);
  }
});

app.listen(9000, () => {
  console.log("Mail Sender Started!! 9000");
});

async function postVideoToProcess(json) {
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

// app.post("/node-video-uploads", upload.single("webcam"), async function (
//   req,
//   res
// ) {
//   if (!req.file) {
//     console.log("No file received");
//     return res.status(400).json({ message: "Can't upload" });
//   } else {
//     await writeFile(req.file).then(async () => {
//       res.status(200).json({ message: "success" });
//       await postVideo(req.file).then(async (fromBackend) => {
//         console.log(fromBackend);
//         await removeFile(req.file.originalname);
//       });
//     });
//   }
// });

// function writeFile(file) {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(file.originalname, file.buffer, function (error) {
//       if (error) reject(error);
//       console.log("file received");
//     });
//     resolve("file created successfully with handcrafted Promise!");
//   });
// }

// function removeFile(originalname) {
//   return new Promise((resolve, reject) => {
//     fs.unlink(originalname, (error) => {
//       if (error) reject(error);
//     });
//     resolve("file removed successfully!");
//   });
// }
