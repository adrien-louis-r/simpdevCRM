import React from "react";
import classnames from "classnames";

function makeButtonClasses(importance, reverse, destructive, className) {
  const baseClasses = {
    "font-bold py-2 px-4 rounded": true,
    "focus:outline-none focus:shadow-outline": !reverse,
    "focus:outline-none focus:shadow-outlineReverse": reverse,
  };
  const primaryRules = {
    "bg-primary hover:bg-primaryVariant": importance === "primary" && !reverse,
    "bg-secondary hover:bg-secondaryVariant":
      importance === "primary" && reverse,
    "text-white": importance === "primary",
  };
  const secondaryRules = {
    "bg-white text-primary hover:bg-primaryLight": importance === "secondary",
    border: importance === "secondary" && !reverse,
  };
  const tertiaryRules = {
    "bg-transparent text-primary hover:bg-primaryLight":
      importance === "tertiary",
    "text-white hover:text-primary": importance === "tertiary" && reverse,
  };
  const destructiveRules = {
    "text-white": importance === "primary",
    "bg-danger hover:bg-dangerVariant": importance === "primary" && destructive,
    "bg-white text-danger hover:bg-dangerLight":
      importance === "secondary" && destructive,
    "bg-transparent text-danger hover:bg-dangerLight":
      importance === "tertiary" && destructive && !reverse,
    "text-white hover:text-danger hover:bg-dangerLight":
      importance === "tertiary" && reverse && destructive,
  };

  return destructive
    ? classnames(baseClasses, destructiveRules, className)
    : classnames(
        baseClasses,
        primaryRules,
        secondaryRules,
        tertiaryRules,
        className
      );
}

function Button({
  children,
  importance = "secondary",
  reverse = false,
  destructive = false,
  className = "",
  ...props
}) {
  const classes = makeButtonClasses(
    importance,
    reverse,
    destructive,
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
export { makeButtonClasses };
