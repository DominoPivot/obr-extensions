import "./mask-icon.css";

/**
 * Fixed-size icon implemented by using an image as a mask.
 * The icon will agree in color with the `color` property of the element.
 *
 * The custom element takes care of reapplying the mask on src attribute change.
 * Otherwise, the mask-icon class can be used along with the --mask-image property.
 * Detecting clicks on a mask-icon is a bad idea; wrap the icon in a solid element.
 */
customElements.define("mask-icon", class extends HTMLElement {
    static observedAttributes = ["src"];
    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null) {
        this.style.setProperty("--mask-image", newValue === null ? "none" : `url(${encodeURI(newValue)})`);
    }
});
