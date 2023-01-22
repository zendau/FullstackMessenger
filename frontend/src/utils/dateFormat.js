export default function (alertDate, locale) {
  const date = new Date(alertDate);
  const alertLocale = locale === "en" ? "en-US" : "ru-RU";
  const alertOptions = { year: "numeric", month: "long", day: "numeric" };

  return new Intl.DateTimeFormat(alertLocale, alertOptions).format(date);
}
