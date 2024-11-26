import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import { IconLink } from "../components/icon-link.js";
import { MaskIcon } from "../components/mask-icon.js";
import { RangeGrid } from "./range-grid.js";
import { useStore } from "./useStore.js";

// synchronize with OBR when available
useStore.getState().connect();

function App () {
    const [initialized, setInitialized] = useState(false);
    const sceneReady = useStore(state => state.sceneReady);
    const themeMode = useStore(state => state.themeMode);
    if (!initialized && sceneReady) setInitialized(true);

    const classList = [
        "action-popover",
        themeMode === "DARK" ? "dark-theme" : "light-theme",
    ];

    return <section className={classList.join(" ")}>
        <header className="flex-row">
            <span className="extension-name">O Ranges</span>
            <IconLink href="credits.html" target="_blank" aria-label="Credits" title="Credits">
                <MaskIcon src="../material-symbols/attribution.svg" />
            </IconLink>
            <IconLink href="help.html" target="_blank" aria-label="Help" title="Help">
                <MaskIcon src="../material-symbols/help.svg" />
            </IconLink>
        </header>
        {
            initialized
                ? <RangeGrid />
                : <span className="dimmed">Open a scene to start using O Ranges.</span>
        }
    </section>
}

createRoot(document.body.appendChild(document.createElement("div"))).render(
    <StrictMode>
        <App />
    </StrictMode>
);
