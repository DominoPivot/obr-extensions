import OBR from "@owlbear-rodeo/sdk";
import "../custom-elements/mask-icon.js";
import "./range-grid.js";

import { handleThemeChange } from "../theme.js";

OBR.onReady(async () => {
    OBR.theme.getTheme().then(handleThemeChange);
    OBR.theme.onChange(handleThemeChange);
});
