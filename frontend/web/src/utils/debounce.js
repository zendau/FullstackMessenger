export default function debounce(cb, delay = 1000) {
  let lastCall;
  return (...args) => {
    clearTimeout(lastCall);
    lastCall = setTimeout(() => cb(...args), delay);
  };
}
