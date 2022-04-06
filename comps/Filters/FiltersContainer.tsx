import React from 'react';
import Filterbox from './Filterbox';
import Searchbar from './Searchbar';
import SortDropdown from './SortDropdown';
import styles from '../../styles/Home.module.css';
import { Keyable } from '../../types';

export default function FiltersContainer(props: Keyable) {
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
        resetFilters={props.resetFilters}
        filteredCategories={props.filteredCategories}
        categories={props.categories}
        hideExcludedEntries={props.hideExcludedEntries}
        entriesMarkedAsExcluded={props.entriesMarkedAsExcluded}
        removeFromExcluded={props.removeFromExcluded}
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
