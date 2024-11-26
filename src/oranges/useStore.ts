import type { Grid, GridMeasurement, GridScale, GridType, Item, Player, Theme } from "@owlbear-rodeo/sdk";
import OBR from "@owlbear-rodeo/sdk";
import { create } from "zustand";

type State = {
    sceneReady: boolean,
    grid: {
        dpi: number,
        measurement: GridMeasurement,
        scale: GridScale,
        type: GridType,
    },
    playerColor: string,
    selection: Item[],
    themeMode: "DARK" | "LIGHT",

    connect: () => void,
};

export const useStore = create<State>()(set => {
    return {
        sceneReady: false,
        grid: {
            dpi: 150,
            measurement: "CHEBYSHEV",
            scale: {
                raw: "5ft",
                parsed: {
                    multiplier: 5,
                    unit: "ft",
                    digits: 0,
                },
            },
            type: "SQUARE",
        },
        playerColor: "orange",
        selection: [],
        themeMode: "DARK",

        connect () {
            // discourage double-connecting
            set({ connect: () => console.warn("Tried to connect store to OBR multiple times.") });

            OBR.onReady(() => {
                // fetch scene properties and watch for changes
                OBR.scene.isReady().then(handleSceneIsReady);
                OBR.scene.onReadyChange(sceneReady => set({ sceneReady }));
                OBR.scene.grid.onChange(handleGridChange);

                // fetch player properties and watch for changes
                OBR.player.getColor().then(playerColor => set({ playerColor }));
                OBR.player.getSelection().then(fetchSelectedItems);
                OBR.player.onChange(handlePlayerChange);

                // fetch theme mode and watch for changes
                OBR.theme.getTheme().then(handleThemeChange);
                OBR.theme.onChange(handleThemeChange);
            });
        },
    };

    async function handleSceneIsReady(sceneReady: boolean) {
        set({ sceneReady });
        if (sceneReady) {
            const [dpi, measurement, scale, type] = await Promise.all([
                OBR.scene.grid.getDpi(),
                OBR.scene.grid.getMeasurement(),
                OBR.scene.grid.getScale(),
                OBR.scene.grid.getType(),
            ]);
            set({ grid: { dpi, measurement, scale, type } });
        }
    }

    async function handleGridChange({ dpi, measurement, type }: Grid) {
        const scale = await OBR.scene.grid.getScale();
        set({ grid: { dpi, measurement, scale, type } });
    }

    async function fetchSelectedItems (items: string[] | undefined) {
        set({ selection: items ? await OBR.scene.items.getItems(items) : [] });
    }

    function handlePlayerChange ({ color, selection }: Player) {
        set({ playerColor: color });
        fetchSelectedItems(selection);
    }

    function handleThemeChange(theme: Theme) {
        set({ themeMode: theme.mode });
    }
});
