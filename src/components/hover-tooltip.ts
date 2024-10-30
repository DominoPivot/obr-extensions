import "./hover-tooltip.css";

customElements.define("hover-tooltip", class extends HTMLElement {
    constructor () {
        super();
        this.hidden = true;
        this.role = "tooltip";

        const owner = this.parentElement;
        if (owner) {
            const rect = owner.getBoundingClientRect();
            const center = owner.ownerDocument.documentElement.clientWidth / 2;
            this.ownerDocument.documentElement.appendChild(this);

            const show = () => {
                if (rect.x <= center) {
                    this.style.left = rect.left + "px";
                } else {
                    this.style.right = rect.right - rect.left + "px";
                }
                this.style.top = `calc(${rect.bottom}px + 1em)`;
                this.hidden = false;
            };
            const hide = () => {
                this.hidden = true;
            }

            owner.addEventListener("pointermove", show);
            owner.addEventListener("pointerleave", hide);
            owner.addEventListener("focus", show);
            owner.addEventListener("blur", hide);

        }
    }
});
