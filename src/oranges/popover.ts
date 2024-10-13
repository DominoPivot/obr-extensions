import OBR from "@owlbear-rodeo/sdk";
import { handleThemeChange } from "../theme.js";
OBR.onReady(async () => {
    OBR.theme.getTheme().then(handleThemeChange);
    OBR.theme.onChange(handleThemeChange);
});
