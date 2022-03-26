import React from "react";
import Filterbox from "./Filterbox";
import Searchbar from "./Searchbar";
import SortDropdown from "./SortDropdown";

export default function FiltersContainer(props) {
  return (
    <>
      <Filterbox
        filterboxAnchorEl={props.filterboxAnchorEl}
        setFilterboxAnchorEl={props.setFilterboxAnchorEl}
        canonicityFilterValue={props.canonicityFilterValue}
        filterEntries={props.filterEntries}
        finishedFilterValue={props.finishedFilterValue}
        filteredCreatorsName={props.filteredCreatorsName}
        creators={props.creators}
        filteredEras={props.filteredEras}
        resetFilters={props.resetFilters}
        eras={props.eras}
      />

      <Searchbar
        fetchedTitles={props.fetchedTitles}
        searchValue={props.searchValue}
        setSearchValue={props.setSearchValue}
        searchEntries={props.searchEntries}
      />

      <SortDropdown
        sortBy={props.sortBy}
        orderBy={props.orderBy}
        moduleKeys={props.moduleKeys}
      />
    </>
  );
}