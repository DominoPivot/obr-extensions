import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import "./icon-link.css";

type IconLinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>;

/**
 * Styled component for a small symmetrical element meant to hold an icon.
 * Similar in appearance to `IconButton`, but carries hyperlink semantics.
 * All props will be forwarded to the internal anchor element.
 */
export function IconLink ({ className = "icon-link", children, ...props }: IconLinkProps) {
    return (
        <a className={className} {...props}>
            {children}
        </a>
    );
}
