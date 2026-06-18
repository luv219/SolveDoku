import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface BaseButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseButtonProps, PropsWithChildren {
  to?: never;
}

interface ButtonLinkProps extends BaseButtonProps, PropsWithChildren {
  to: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-emerald-600",
  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:border-emerald-500 hover:text-emerald-700 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  ghost:
    "text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-emerald-600 dark:text-slate-200 dark:hover:bg-slate-800",
};

const baseClasses =
  "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export default function Button(props: ButtonProps | ButtonLinkProps) {
  if ("to" in props && typeof props.to === "string") {
    const { children, className = "", variant = "primary", to } = props;
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  const { children, className = "", variant = "primary", ...buttonProps } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
