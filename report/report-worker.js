const axios = require("axios").default;
let uuid = null;
let to_email = null;
let start_end_time = null;
let fontEndTimeStamp = null;
let clickTime = null;
let reactionTime = null;
let behavior = null;
let checkBox = null;
let result = null;
let info = null;

const reportWorker = (workerData) => {
  uuid = workerData.uuid;
  to_email = workerData.to_email;
  start_end_time = workerData.start_end_time;
  fontEndTimeStamp = workerData.fontEndTimeStamp;
  clickTime = workerData.clickTime;
  reactionTime = workerData.reactionTime;
  behavior = workerData.behavior;
  checkBox = workerData.checkBox;
  result = workerData.result;
  info = workerData.info;

  if (uuid != null) {
    var packedJson = JSON.stringify({
      uuid: uuid,
      to_email: to_email,
      start_end_time: start_end_time,
      fontEndTimeStamp: fontEndTimeStamp,
      clickTime: clickTime,
      reactionTime: reactionTime,
      behavior: behavior,
      checkBox: checkBox,
      result: result,
      info: info,
    });
    postVideoToProcess(packedJson).then((result) => {
      console.log("Result Backend Is : " + result);
    });
  }
};

async function postVideoToProcess(json) {
  return axios
    .post("http://server:5000/process-video", json, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => response.data)
    .catch((error) => console.log(error));
}
module.exports = { reportWorker };
