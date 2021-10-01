import "./report.scss";
import Download from "../../assets/icons/download-icon.svg";
import CheckOn from "../../assets/icons/check-box-on.svg";
import CheckOff from "../../assets/icons/check-box-off.svg";
import QuestionnaireIcon from "../../assets/icons/questionnaire-icon.svg";
import Send from "../../assets/icons/send.svg";

import Angry from "../../assets/icons/angry-icon.svg";
import Happy from "../../assets/icons/happy-icon.svg";
import Neutral from "../../assets/icons/neutral-icon.svg";
import Sad from "../../assets/icons/sad-icon.svg";

import { UploadImage } from "../../services/mail-sender-service.js";

import { useState, useEffect } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { Container } from "react-bulma-components";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export function Report(props) {
  const [checkBox, setCheckBox] = useState(1);
  const [clickTime, setClickTime] = useState([]);
  const [reactionTime, setReactionTime] = useState([]);
  const [emotion, setEmotion] = useState();
  const [uuid, setUuid] = useState();
  const [behavior, setBehavior] = useState();
  const [questionnaire_uuid, setQuestionnaire_uuid] = useState();

  const [isLoaded, setIsLoaded] = useState(false);

  const [email, setEmail] = useState();
  const [sendingMail, setSendingMail] = useState(false);

  useEffect(() => {
    setCheckBox(props.location.state.checkBox);
    setClickTime(props.location.state.clickTime);
    setReactionTime(props.location.state.reactionTime);
    setEmotion(props.location.state.emotion);
    setUuid(props.location.state.uuid);
    setBehavior(props.location.state.behavior);
    setQuestionnaire_uuid(props.location.state.questionnaire_uuid);
    setIsLoaded(true);
  }, [
    checkBox,
    clickTime,
    reactionTime,
    emotion,
    uuid,
    behavior,
    questionnaire_uuid,
    props.location.state.checkBox,
    props.location.state.clickTime,
    props.location.state.reactionTime,
    props.location.state.emotion,
    props.location.state.uuid,
    props.location.state.behavior,
    props.location.state.questionnaire_uuid,
  ]);

  useEffect(() => {
    if (isLoaded) {
      uploadResultImage();
    }
  }, []);

  function padLeadingZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  function checkBoxSelected(type) {
    if (checkBox == type) {
      return CheckOn;
    }
    return CheckOff;
  }

  function checkBoxSelectedTextHighlight(type) {
    if (checkBox == type) {
      return true;
    }
    return false;
  }

  function showEmotionIcon(emotePerQuestion) {
    return (
      <div className="emote-group-table">
        {emotePerQuestion[0] ? <img alt="Angry" src={Angry} /> : <div />}
        {emotePerQuestion[1] ? <img alt="Happy" src={Happy} /> : <div />}
        {emotePerQuestion[2] ? <img alt="Neutral" src={Neutral} /> : <div />}
        {emotePerQuestion[3] ? <img alt="Sad" src={Sad} /> : <div />}
      </div>
    );
  }

  function showClickTime(click) {
    if (click === null) {
      return "NOT CLICKED";
    }
    return click + " น.";
  }

  function checkEmotionUndefined(n) {
    if (typeof emotion !== "undefined") {
      return showEmotionIcon(emotion[n]);
    }
    return <div />;
  }
  function checkBehaviorUndefined(n) {
    if (typeof behavior !== "undefined") {
      return (
        <div className="behavior">
          {behavior[n].includes("Changed") ? (
            <div className="behavior change">
              <h>Change</h>
            </div>
          ) : (
            <div />
          )}
          {behavior[n].includes("Skip") ? (
            <div className="behavior skip">
              <h>Skip</h>
            </div>
          ) : (
            <div />
          )}
        </div>
      );
    }
    return "";
  }

  function createData(
    ItemQuestion,
    ClickTime,
    ReactionTime,
    Emotion,
    Behavior
  ) {
    return { ItemQuestion, ClickTime, ReactionTime, Emotion, Behavior };
  }

  const rows = [
    createData(
      "Question 1",
      showClickTime(clickTime[0]),
      reactionTime[0] / 1000,
      checkEmotionUndefined(0),
      checkBehaviorUndefined(0)
    ),
    createData(
      "Question 2",
      showClickTime(clickTime[1]),
      reactionTime[1] / 1000,
      checkEmotionUndefined(1),
      checkBehaviorUndefined(1)
    ),
    createData(
      "Question 3",
      showClickTime(clickTime[2]),
      reactionTime[2] / 1000,
      checkEmotionUndefined(2),
      checkBehaviorUndefined(2)
    ),
    createData(
      "Question 4",
      showClickTime(clickTime[3]),
      reactionTime[3] / 1000,
      checkEmotionUndefined(3),
      checkBehaviorUndefined(3)
    ),
    createData(
      "Question 5",
      showClickTime(clickTime[4]),
      reactionTime[4] / 1000,
      checkEmotionUndefined(4),
      checkBehaviorUndefined(4)
    ),
    createData(
      "Question 6",
      showClickTime(clickTime[5]),
      reactionTime[5] / 1000,
      checkEmotionUndefined(5),
      checkBehaviorUndefined(5)
    ),
    createData(
      "Question 7",
      showClickTime(clickTime[6]),
      reactionTime[6] / 1000,
      checkEmotionUndefined(6),
      checkBehaviorUndefined(6)
    ),
    createData(
      "Question 8",
      showClickTime(clickTime[7]),
      reactionTime[7] / 1000,
      checkEmotionUndefined(7),
      checkBehaviorUndefined(7)
    ),
    createData(
      "Question 9",
      showClickTime(clickTime[8]),
      reactionTime[8] / 1000,
      checkEmotionUndefined(8),
      checkBehaviorUndefined(8)
    ),
  ];

  const useStyles = makeStyles({
    table: {
      minWidth: 700,
      maxWidth: 1100,
    },
  });

  function handleOnSaveResult() {
    var container = document.getElementById("report-paper");
    domtoimage
      .toBlob(container, {
        style: {
          "font-family": "Prompt",
        },
      })
      .then(function (blob) {
        saveAs(blob, "[PHQ-9]Result.png");
      });
  }

  function uploadResultImage(to_email) {
    setSendingMail(true);
    var container = document.getElementById("report-paper");
    domtoimage
      .toBlob(container, {
        style: {
          "font-family": "Prompt",
        },
      })
      .then(function (blob) {
        var result = UploadImage(questionnaire_uuid, blob, to_email);
        setTimeout(() => {
          setSendingMail(false);
        }, 6000);
        console.log(result);
      });
  }

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  const classes = useStyles();
  return (
    <Container className="paper-container" id="report-paper">
      <div className="form-header-box">
        <div className="form-text-header">
          <p className="personal-id">รหัส {padLeadingZeros(uuid, 6)}</p>
          <center>
            <strong>
              <p>รายงานวิเคราะห์แนวโน้มภาวะซึมเศร้า</p>
            </strong>
          </center>
          <div className="group-type">
            <p>ประเภทกลุ่มตัวอย่าง</p>
            <p
              id={`${checkBoxSelectedTextHighlight(1) ? "selected-group" : ""}`}
            >
              <img alt="check" src={checkBoxSelected(1)} /> ปกติ
            </p>
            <p
              id={`${checkBoxSelectedTextHighlight(2) ? "selected-group" : ""}`}
            >
              <img alt="check" src={checkBoxSelected(2)} /> มีภาวะซึมเศร้า
            </p>
            <p
              id={`${checkBoxSelectedTextHighlight(3) ? "selected-group" : ""}`}
            >
              <img alt="check" src={checkBoxSelected(3)} /> กำลังรักษา
            </p>
          </div>
          <div className="personal-info">
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
        <div className="form-emotion">
          <div className="icon-symbol">
            <img alt="emote" src={Angry} />
            <h style={{ color: "#B5453C" }}>Angry</h>
          </div>
          <div className="icon-symbol">
            <img alt="emote" src={Happy} />
            <h style={{ color: "#00D4D4" }}>Happy</h>
          </div>
          <div className="icon-symbol">
            <img alt="emote" src={Neutral} />
            <h style={{ color: "#699DEE" }}>Neutral</h>
          </div>
          <div className="icon-symbol">
            <img alt="emote" src={Sad} />
            <h style={{ color: "#2E3552" }}>Sad</h>
          </div>
        </div>
      </div>
      <TableContainer className="table-container">
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>ITEM QUESTION</TableCell>
              <TableCell align="center">CLICK TIME</TableCell>
              <TableCell align="center">REACTION TIME (Sec.)</TableCell>
              <TableCell align="center">EMOTION</TableCell>
              <TableCell align="center">BEHAVIOR</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ItemQuestion}>
                <TableCell component="th" scope="row">
                  {row.ItemQuestion}
                </TableCell>
                <TableCell align="center">{row.ClickTime}</TableCell>
                <TableCell align="center">{row.ReactionTime}</TableCell>
                <TableCell align="center">{row.Emotion}</TableCell>
                <TableCell align="center">{row.Behavior}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Report;
