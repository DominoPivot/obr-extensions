import "./range-grid.css";

/**
 * Grid used to define ranges outlined by O Ranges.
 * Uses the template defined in popover.html for its rows.
 * Manages the focus and state of its children.
 */
customElements.define("range-grid", class extends HTMLElement {
    #internals: ElementInternals;
    constructor () {
        super();

        this.#internals = this.attachInternals();
        this.#internals.role = "grid";
    }

    connectedCallback () {
        const rowTemplate = this.querySelector("template")?.content.firstElementChild;
        if (!rowTemplate) {
            console.error("range-grid template not found.");
            return;
        }

        const createRow = () => {
            const row = rowTemplate.cloneNode(true) as HTMLTableRowElement;

        }
    }
});

customElements.define("grid-row", class extends HTMLElement {
    constructor () {
        super();
        this.attachInternals().role = "row";
    }
});

customElements.define("grid-cell", class extends HTMLElement {
    constructor () {
        super();
        this.attachInternals().role = "gridcell";
    }
});
