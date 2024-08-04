import { saveAs } from "file-saver";

const mimeType = "audio/ogg; codecs=opus";
const chunks = [];

export function startRecordAudio(mainStream, streams, roomTitle) {
  const audioContext = new AudioContext();
  const dest = audioContext.createMediaStreamDestination();

  audioContext.createMediaStreamSource(mainStream).connect(dest);

  streams.forEach((stream) => {
    audioContext.createMediaStreamSource(stream).connect(dest);
  });

  const finalStream = dest.stream;
  const mediaRecorder = new MediaRecorder(finalStream);
  mediaRecorder.onstop = () => {
    downlaodAudio(roomTitle);
  };

  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };

  mediaRecorder.start();

  return mediaRecorder;
}

function downlaodAudio(roomTitle) {
  const blob = new Blob(chunks, { type: mimeType });
  const date = new Date();

  const dataOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timezone: "UTC",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  saveAs(blob, `${roomTitle}-${date.toLocaleString("en", dataOptions)}.ogg`);
}
