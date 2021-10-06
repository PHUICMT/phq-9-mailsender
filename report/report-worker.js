// const { parentPort, workerData } = require("worker_threads");
const axios = require("axios").default;
let uuid = null;
let to_email = null;
let start_end_time = null;
let fontEndTimeStamp = null;
let clickTime = null;
let reactionTime = null;
let behavior = null;
let checkBox = null;

const reportWorker = (workerData) => {
  uuid = workerData.uuid;
  to_email = workerData.to_email;
  start_end_time = workerData.start_end_time;
  fontEndTimeStamp = workerData.fontEndTimeStamp;
  clickTime = workerData.clickTime;
  reactionTime = workerData.reactionTime;
  behavior = workerData.behavior;
  checkBox = workerData.checkBox;
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

async function processDataFromBackend(dataFromBackend) {
  if (dataFromBackend != null) {
    var Emote = emoteTimeLength(dataFromBackend.total_emotion_time);
    var stringEmote = getEmotePerQuestion(Emote);
    var stringClickTime = showClickTime(clickTime);
    var stringReactionTime = getReactionsTimes(reactionTime);
    var stringBehavior = getBehavior(behavior);
    var setingGroupsTest = getGroupType(checkBox);

    var json = JSON.stringify({
      to_email: to_email,
      uuid: uuid,
      stringEmote: stringEmote,
      stringClickTime: stringClickTime,
      stringReactionTime: stringReactionTime,
      stringBehavior: stringBehavior,
      setingGroupsTest: setingGroupsTest,
    });
    var mail_result = null;
    MailSender(json).then((result) => {
      mail_result = result;
    });
    if (mail_result != undefined) {
      return mail_result;
    }
  }
}

async function MailSender(json) {
  return axios
    .post("http://server:5000/send-mail", json, {
      headers: { "Content-Type": "application/json;charset=UTF-8" },
    })
    .then((response) => response.data)
    .catch((error) => console.log(error));
}

async function emoteTimeLength(total_emotion_time) {
  var allEmote = [];
  var Angry = total_emotion_time.angry;
  var Happy = total_emotion_time.happy;
  var Neutral = total_emotion_time.neutral;
  var Sad = total_emotion_time.sad;

  await clickTime.forEach((dummy, i) => {
    var emotePerQuestion = [false, false, false, false]; //Angry, Happy, Neutral, Sad
    fontEndTimeStamp[i].map((timeLength) => {
      var start = timeLength[0];
      var end = timeLength[1];
      if (start > 10000000) {
        start = Math.abs(start - start_end_time[0]);
      }
      if (end > 10000000) {
        end = Math.abs(end - start_end_time[0]);
      }

      Angry.map((timeStamp) => {
        if (timeStamp > start && timeStamp < end) {
          emotePerQuestion[0] = true;
        }
      });
      Happy.map((timeStamp) => {
        if (timeStamp > start && timeStamp < end) {
          emotePerQuestion[1] = true;
        }
      });
      Neutral.map((timeStamp) => {
        if (timeStamp > start && timeStamp < end) {
          emotePerQuestion[2] = true;
        }
      });
      Sad.map((timeStamp) => {
        if (timeStamp > start && timeStamp < end) {
          emotePerQuestion[3] = true;
        }
      });
    });
    allEmote.push(emotePerQuestion);
    emotePerQuestion = [false, false, false, false];
  });
  return allEmote;
}

function getGroupType(checkBox) {
  result = "กลุ่มผู้เข้าทดสอบ : ";
  if (checkBox == 1) {
    result = "ปกติ";
  }
  if (checkBox == 2) {
    result = "มีภาวะซึมเศร้า";
  }
  if (checkBox == 3) {
    result = "กำลังรักษา";
  }
  return result;
}

function getReactionsTimes(reactionTime) {
  var result = "";
  reactionTime.map((timeLong, index) => {
    result += "ข้อ " + index + " -> ใช้เวลา "(timeLong / 1000) + "\n";
  });
  return result;
}

function showClickTime(clickTime) {
  var timeClick = "";
  clickTime.map((click, index) => {
    var question = "ข้อ" + index + " -> ";
    if (click === null) {
      question += "NOT CLICKED";
    } else {
      question += click + " น.";
    }
    timeClick += question + "\n";
  });
  return timeClick;
}

function getBehavior(behavior) {
  var result = "";
  if (typeof behavior !== "undefined") {
    behavior.map((item, index) => {
      result += "ข้อ " + index + " -> " + item + "\n";
    });
  }
  return result;
}

function getEmotePerQuestion(emote) {
  var result = "";
  if (typeof emote !== "undefined") {
    emote.map((perQuestion) => {
      if (perQuestion[0]) {
        result += " |Angry| ";
      }
      if (perQuestion[1]) {
        result += " |Happy| ";
      }
      if (perQuestion[2]) {
        result += " |Neutral| ";
      }
      if (perQuestion[3]) {
        result += " |Sad| ";
      }
    });
  }
  return result;
}

module.exports = { reportWorker, processDataFromBackend };

// async () => {
//   if (uuid != undefined) {
//     parentPort.postMessage({ fromWorker: workerData });

//     var packedJson = JSON.stringify({ uuid: uuid, to_email: to_email });
//     postVideoToProcess(packedJson)
//       .then((result) => {
//         console.log("Result Backend Is : " + result);
//         console.log(result);
//       })
//       .finally(async (result) => {
//         console.log("Starting processDataFromBackend");
//         return processDataFromBackend(result).then((mail_result) => {
//           console.log(": mail_result : ");
//           console.log(mail_result);
//         });
//       });
//   }
// };
