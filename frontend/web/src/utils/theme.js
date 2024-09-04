export const themes = {
  dark: "dark",
  light: "light",
};

export function getUserTheme() {
  let theme = `${window?.localStorage?.getItem("theme")}`;
  if (!Object.values(themes).includes(theme)) {
    const userMedia = window.matchMedia("(prefers-color-scheme: light)");
    if (userMedia.matches) theme = themes.light;
    else theme = themes.dark;
  }

  applyTheme(theme);

  return theme;
}

export function toggleTheme(theme) {
  if (theme === themes.dark) theme = themes.light;
  else if (theme === themes.light) theme = themes.dark;
  else return;

  applyTheme(theme);

  return theme;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}
