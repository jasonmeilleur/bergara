import { Link } from "react-router-dom";
import { SITE_LOGO_URL, SITE_NAME } from "../lib/site";

interface LogoProps {
  className?: string;
  /** Render white logo for dark backgrounds. */
  inverted?: boolean;
  heightClass?: string;
}

export function Logo({
  className = "",
  inverted = false,
  heightClass = "h-8",
}: LogoProps) {
  return (
    <img
      src={SITE_LOGO_URL}
      alt={SITE_NAME}
      width={160}
      height={40}
      className={`w-auto ${heightClass} ${inverted ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}

interface LogoLinkProps extends LogoProps {
  onClick?: () => void;
}

export function LogoLink({ onClick, ...logoProps }: LogoLinkProps) {
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center"
      onClick={onClick}
      aria-label={`${SITE_NAME} home`}
    >
      <Logo {...logoProps} />
    </Link>
  );
}
