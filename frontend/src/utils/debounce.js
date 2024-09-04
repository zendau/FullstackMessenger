export default function debounce(cb, delay = 1000) {
  let lastCall;
  console.log("debounce", delay, lastCall);
  return (...args) => {
    clearTimeout(lastCall);
    console.log("delay", delay);
    lastCall = setTimeout(() => cb(...args), delay);
  };
}
