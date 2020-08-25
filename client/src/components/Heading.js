import React from "react";

function H1({ children, className = "" }) {
  return <h1 className={`${className} text-6xl font-bold`}>{children}</h1>;
}

function H2({ children, className = "" }) {
  return <h2 className={`${className} text-5xl `}>{children}</h2>;
}

function H3({ children, className = "" }) {
  return <h3 className={`${className} text-4xl font-bold`}>{children}</h3>;
}

function H4({ children, className = "" }) {
  return <h4 className={`${className} text-2xl font-bold`}>{children}</h4>;
}

function H5({ children, className = "" }) {
  return <h5 className={`${className} text-2xl`}>{children}</h5>;
}

function H6({ children, className = "" }) {
  return <h6 className={`${className} text-xl`}>{children}</h6>;
}

export { H1, H2, H3, H4, H5, H6 };
