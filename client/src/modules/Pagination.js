import React from "react";
import Link from "../components/Link";

function Pagination({ total, pageCount, prev, next }) {
  return (
    <div>
      {`${total} items, ${pageCount} pages`}
      <Link to={prev}>Prev</Link>
      <Link to={next}>Next</Link>
    </div>
  );
}

export default Pagination;
