import React from 'react';
import Filterbox from './Filterbox';
import Searchbar from './Searchbar';
import SortDropdown from './SortDropdown';
import styles from '../../styles/Home.module.css';
import { Keyable } from '../../types';

export default function FiltersContainer() {
  return (
    <div className={styles.filtersContainer}>
      <Filterbox />
      <Searchbar />
      <SortDropdown />
    </div>
  );
}
