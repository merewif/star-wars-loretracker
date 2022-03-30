import React from "react";
import Filterbox from "./Filterbox";
import Searchbar from "./Searchbar";
import SortDropdown from "./SortDropdown";
import styles from "../../styles/Home.module.css";

export default function FiltersContainer(props) {
  return (
    <div className={styles.filtersContainer}>
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
        filteredCategories={props.filteredCategories}
        categories={props.categories}
        hideExcludedEntries={props.hideExcludedEntries}
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
    </div>
  );
}
