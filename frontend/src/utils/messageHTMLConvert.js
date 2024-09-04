export default function messageHTMLConvert(text) {
  return text?.replaceAll("<br>", " ").replace(/<\/?[^>]+(>|$)/g, "");
}
