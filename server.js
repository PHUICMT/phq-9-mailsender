const tools = require("./report/report-worker");
const express = require("express");

const amqp = require("amqplib"); // .connect("amqp://admin:admin@rabbitmq:5672");
const queue = "dataFromBackend";
const app = express();
let rabbitConnection = null;

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

start()
  .then(() => app.listen(5001, () => console.log("Mail Sender Started!! 5001")))
  .catch((err) => console.error(err));

function start() {
  return amqp.connect(
    "amqp://admin:admin@rabbitmq:5672/" + "?heartbeat=60",
    function (err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }
      conn.on("error", function (err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function () {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
      console.log("[AMQP] connected");
      rabbitConnection = conn;
      startWorker();
    }
  );
}

function startWorker() {
  rabbitConnection.createChannel(function (err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function (err) {
      console.error("[AMQP] channel error", err.message);
    });
    ch.on("close", function () {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(10);
    ch.assertQueue(queue, { durable: true }, function (err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });
  });
}

function processMsg(msg) {
  work(msg, function (ok) {
    try {
      if (ok) ch.ack(msg);
      else ch.reject(msg, true);
    } catch (e) {
      closeOnErr(e);
    }
  });
}

function work(msg, cb) {
  console.log("processing : ", msg.content.toString());
  cb(true);
}

function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  rabbitConnection.close();
  return true;
}
