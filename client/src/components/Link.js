import React from "react";
import { Link, NavLink } from "react-router-dom";
import { makeButtonClasses } from "./Button";
import classnames from "classnames";

function CustomLink({
  children,
  buttonAppearance = false,
  buttonProps: {
    importance = "secondary",
    reverse = false,
    destructive = false,
  } = {},
  isNav = false,
  raw = false,
  className = "",
  ...props
}) {
  const classes = buttonAppearance
    ? makeButtonClasses(importance, reverse, destructive, className)
    : classnames(className, {
        "font-bold underline hover:text-secondary": !raw,
      });

  const Component = isNav ? NavLink : Link;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}

export default CustomLink;
