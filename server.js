const { Worker } = require("worker_threads");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/select-to-process", function (req, res) {
  if (!req.body) {
    console.log("No file received");
    return res.status(400).json({ message: "Can't Accept" });
  } else {
    const worker = new Worker("./report/report-worker.js", {
      workerData: req.body,
    });

    res.status(200);

    worker.on("message", (result) => {
      console.log(result.message);
      if (result.message == true) {
        res.status(400).json({ message: "Process finished!" });
        console.log("Worker running: " + result);
      }
    });

    worker.on("error", (error) => {
      res.status(400);
      console.log(error);
    });

    worker.on("exit", (exitCode) => {
      console.log(`It exited with code ${exitCode}`);
    });
  }
});

app.listen(9000, () => {
  console.log("Mail Sender Started!! 9000");
});

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
