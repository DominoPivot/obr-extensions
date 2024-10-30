import "./svg-icon.css";

customElements.define("svg-icon", class extends HTMLElement {
    static observedAttributes = ["src", "width", "height"];

    attributeChangedCallback (name: string, oldValue: string, value: string) {
        switch (name) {
            case "src":
                this.style.mask = `url(${encodeURI(value)}) 0% 0% / contain`;
                break;
            case "width":
                this.style.width = `${value}px`;
                break;
            case "height":
                this.style.height = `${value}px`;
                break;
        }
    }
});
