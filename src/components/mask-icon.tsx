import "./mask-icon.css";

/**
 * Fixed-size icon that agrees with the current text color, implemented using a CSS mask.
 * If `src` is falsy or unspecified, no mask will be applied, rendering a filled box.
 * The created element is empty and has no semantic value.
 */
export function MaskIcon ({ src }: { src?: string }) {
    const mask = src
        ? `url(${src}) 0 0 / contain`
        : "none";

    return <span className="mask-icon" style={{ mask }} />
}
