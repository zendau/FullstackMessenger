export default function (alertDate, locale, withTime = false) {
  const date = new Date(alertDate);
  const alertLocale = locale === "en" ? "en-US" : "ru-RU";
  const alertOptions = { year: "numeric", month: "long", day: "numeric" };

  if (withTime) {
    Object.assign(alertOptions, {
      hour: "numeric",
      minute: "numeric",
    });
  }

  return new Intl.DateTimeFormat(alertLocale, alertOptions).format(date);
}
