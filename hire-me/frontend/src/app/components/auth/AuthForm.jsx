import Link from "next/link";
import { fluid } from "./fluid";

const footerAction = `inline-flex min-h-11 items-center font-semibold text-primary-100 sm:text-primary-300 ${fluid.gapIcon} ${fluid.signupLink}`;

/** Form-level message (server error, success note). Renders nothing when empty. */
export const FormAlert = ({ variant = "error", children }) => {
  if (!children) return null;
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2 font-medium ${fluid.helpText} ${
        isError
          ? "text-red-400 sm:text-red-500"
          : "text-green-400 sm:text-green-600"
      }`}
    >
      <i
        className={`mt-0.5 leading-none ${
          isError ? "fi fi-rr-exclamation" : "fi fi-rr-check"
        }`}
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
};

/** Wraps one input and shows its validation message underneath. */
export const Field = ({ error, center = false, children }) => (
  <div className={`flex flex-col ${center ? "items-center" : ""}`}>
    {children}
    {error && (
      <p
        role="alert"
        className={`mt-1.5 text-red-400 sm:text-red-500 ${
          center ? "text-center" : ""
        } ${fluid.subtitle}`}
      >
        {error}
      </p>
    )}
  </div>
);

export const FooterLink = ({ href, arrow = true, children }) => (
  <Link href={href} className={footerAction}>
    {children}
    {arrow && (
      <i
        className="fi fi-rr-arrow-small-right leading-none"
        aria-hidden="true"
      />
    )}
  </Link>
);

export const FooterButton = ({ children, ...props }) => (
  <button
    type="button"
    className={`${footerAction} disabled:cursor-not-allowed disabled:opacity-60`}
    {...props}
  >
    {children}
  </button>
);

/**
 * Heading + <form> + footer line. Fields go in as children.
 * `noValidate` because validation is done in JS (so messages match the design).
 */
export const AuthForm = ({ title, subtitle, onSubmit, footer, children }) => (
  <>
    <form
      onSubmit={onSubmit}
      noValidate
      className={`flex flex-col ${fluid.formGap}`}
    >
      <div className={`flex flex-col *:text-center ${fluid.headGap}`}>
        <h2
          className={`font-semibold text-background sm:text-neutral-950 ${fluid.welcome}`}
        >
          {title}
        </h2>
        <p
          className={`text-neutral-300 opacity-70 sm:text-neutral-600 ${fluid.subtitle}`}
        >
          {subtitle}
        </p>
      </div>

      <div className={`flex flex-col ${fluid.fieldsGap}`}>{children}</div>
    </form>

    {footer && (
      <p
        className={`flex items-center justify-center text-center font-medium text-neutral-300 sm:text-neutral-500 ${fluid.gapInline} ${fluid.signupMt} ${fluid.signupText}`}
      >
        {footer}
      </p>
    )}
  </>
);
