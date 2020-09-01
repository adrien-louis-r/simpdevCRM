import { useLocation } from "react-router-dom";
import qs from "qs";

export default () => {
  const location = useLocation();
  const search = qs.parse(location.search, { ignoreQueryPrefix: true });
  const size = Number(search.size || 10);
  const page = search.page ? Number(search.page) : 1;
  const from = Math.max(Number((page - 1) * size), 0);

  return {
    size,
    from,
    pageCount: total => {
      return Math.ceil(total / size);
    },
    next: location => {
      return {
        ...location,
        search: qs.stringify({
          page: Math.max(page + 1, 2),
          size,
        }),
      };
    },
    prev: location => {
      return {
        ...location,
        search: qs.stringify({ page: Math.max(page - 1, 1), size }),
      };
    },
  };
};
