import { saveAs } from "file-saver";
import i18n from "@/locales/index";

const mimeType = "video/webm";
let isRecordScreen = null;
let mediaScreenRecorder = null;

export async function startScreenRecorder(isRecordProvide) {
  try {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: true,
    });

    mediaScreenRecorder = createRecorder(stream, mimeType);
    isRecordScreen = isRecordProvide;
  } catch (e) {
    // this.store.commit("alert/setErrorMessage", e.message);
    return false;
  }
}

export function stopScreenRecorder() {
  if (mediaScreenRecorder.state !== "inactive") {
    mediaScreenRecorder.stop();
  }
}

function createRecorder(stream) {
  let recordedChunks = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
    mediaRecorder.stream.getTracks().forEach((track) => {
      track.stop();
    });
    isRecordScreen.value = false;
  };
  mediaRecorder.start(200);
  return mediaRecorder;
}

function saveFile(recordedChunks) {
  const blob = new Blob(recordedChunks, {
    type: mimeType,
  });
  let filename = window.prompt(i18n.global.t("conference.recorder.promptSave"));
  saveAs(blob, `${filename}.webm`);
}
