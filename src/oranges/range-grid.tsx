import { useId, useState } from "react";
import { MaskIcon } from "../components/mask-icon.js";
import "./range-grid.css";
import { useStore } from "./useStore.js";

type Range = {
    value: number,
    role: "target" | "movement",
    shape: "auto" | "circle" | "radius",
};

export function RangeGrid () {
    const grid = useStore(state => state.grid);
    const id = useId();

    const [ranges, setRanges] = useState([] as Range[]);
    const [activeRow, setActiveRow] = useState(-1);
    const [activeCol, setActiveCol] = useState(-1);
    const [editMode, setEditMode] = useState(false);

    const tabIndex = (row: number) => editMode || row === activeRow ? 0 : -1;

    return (
        <table className="range-grid" role="grid">
            <thead>
                <tr>
                    <th scope="col"><button type="button" tabIndex={-1}>Range</button></th>
                    <th scope="col"><button type="button" tabIndex={-1}>Role</button></th>
                    <th scope="col"><button type="button" tabIndex={-1}>Shape</button></th>
                </tr>
            </thead>

            <tbody>
            {ranges.map((range, row) => (
                <tr key={row}>
                    <td>{
                        editMode
                            ? <input type="text" inputMode="decimal" tabIndex={tabIndex(row)} aria-labelledby="" value={range.value} />
                            : <button type="button" tabIndex={tabIndex(row)}>{range.value}</button>
                    }</td>
                    <td>
                        <button type="button" tabIndex={tabIndex(row)} aria-label={`Role: ${range.role}`}>
                            {range.role === "target" && <MaskIcon src="../material-symbols/target.svg" />}
                            {range.role === "movement" && <MaskIcon src="../material-symbols/footprints.svg" />}
                        </button>
                    </td>
                    <td>
                        <button type="button" aria-haspopup="menu" tabIndex={tabIndex(row)}>Shape</button>
                        <menu role="menu" hidden>
                            <li><MaskIcon src="range-square.svg" /><span>Auto</span></li>
                            <li><MaskIcon src="range-alternating.svg" /><span>Auto</span></li>
                            <li><MaskIcon src="range-manhattan.svg" /><span>Auto</span></li>
                            <li><MaskIcon src="../material-symbols/hexagon.svg" /><span>Auto</span></li>
                            <li><MaskIcon src="range-circle.svg" /><span>Circle</span></li>
                            <li><MaskIcon src="range-radius.svg" /><span>Radius (ignores token size)</span></li>
                        </menu>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
