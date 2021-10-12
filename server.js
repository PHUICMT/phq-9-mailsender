const tools = require("./report/report-worker");
const express = require("express");
const app = express();

app.use(express.json());
app.post("/node-select-to-process", function (req, res) {
  if (!req.body) {
    console.log("No file received");
    return res.status(400).json({ message: "Can't Accept" });
  } else {
    tools.reportWorker(req.body);
  }
  return res.status(200).json({ message: "Backend Accepted!" });
});

app.listen(5001, () => console.log("Mail Sender Started!! 5001"));
