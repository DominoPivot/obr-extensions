import type OBR from "@owlbear-rodeo/sdk";
type Theme = Awaited<ReturnType<typeof OBR.theme.getTheme>>;

const LIGHT_THEME = "light-theme";
const DARK_THEME = "dark-theme";

export function handleThemeChange (theme: Theme) {
    const { classList } = document.documentElement;
    if (theme.mode === "DARK") {
        classList.remove(LIGHT_THEME);
        classList.add(DARK_THEME);
    } else {
        classList.remove(DARK_THEME);
        classList.add(LIGHT_THEME);
    }
}
