import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "./icon-button.css";

type IconButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

/**
 * Styled component for a small symmetrical button meant to hold an icon.
 * All props will be forwarded to the internal button element.
 */
export function IconButton ({ className = "icon-button", type = "button", children, ...props }: IconButtonProps)  {
    return (
        <button className={className} type={type} {...props}>
            {children}
        </button>
    );
}
