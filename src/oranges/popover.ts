import OBR from "@owlbear-rodeo/sdk";
import "../components/hover-tooltip.js";
import "../components/svg-icon.js";
import { handleThemeChange } from "../theme.js";

OBR.onReady(async () => {
    OBR.theme.getTheme().then(handleThemeChange);
    OBR.theme.onChange(handleThemeChange);
});
