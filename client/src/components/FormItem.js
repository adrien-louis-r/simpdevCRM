import React from "react";

function FormItem({ name, label, value, handler, error }) {
  const className =
    "shadow appearance-none border rounded w-full py-2 px-3 text-dark leading-tight focus:outline-none focus:shadow-outlineReverse";

  return (
    <div className="mb-4">
      <label className="block text-grey text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        className={error ? `${className} border-danger` : className}
        type={name}
        id={name}
        value={value}
        onChange={handler}
      />
      {error && <p className="text-danger text-xs italic">{error}</p>}
    </div>
  );
}

export default FormItem;
