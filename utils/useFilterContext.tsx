import { createContext, useContext } from 'react';

// export type FilterContext = {
//
// }

export const FilterContext = createContext<any>({
  filterprops: {},
});
export const useFilterContext = () => useContext(FilterContext);
