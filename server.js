const { Worker } = require("worker_threads");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/node-select-to-process", function (req, res) {
  if (!req.body) {
    console.log("No file received");
    return res.status(400).json({ message: "Can't Accept" });
  } else {
    console.log(req.body);
    const worker = new Worker("./report/report-worker.js", {
      workerData: req.body,
    });

    worker.on("message", (result) => {
      console.log(result.message);
      if (result.message != null || result.message != undefined) {
        console.log("Worker running: " + result);
        return res.status(200).json({ message: "Process finished!" });
      }
    });

    worker.on("error", (error) => {
      console.log(error);
      return res.status(400).json({ message: "Process Failed!" });
    });

    worker.on("exit", (exitCode) => {
      console.log(`It exited with code ${exitCode}`);
    });

    return res.status(200).json({ message: "Backend Accepted!" });
  }
});

app.listen(5001, () => {
  console.log("Mail Sender Started!! 5001");
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
