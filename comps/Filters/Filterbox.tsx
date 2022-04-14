import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import HistoryIcon from '@mui/icons-material/History';
import Popover from '@mui/material/Popover';
import FilterListIcon from '@mui/icons-material/FilterList';
import styles from '../../styles/Home.module.css';
import ListOfExcludedEntriesDialog from '../MUI/ListOfExcludedEntriesDialog';
import { useFilterContext } from '../../utils/useFilterContext';

export default function Filterbox() {
  const {
    canonicityFilterValue,
    filterEntries,
    finishedFilterValue,
    filteredCreatorsName,
    creators,
    filteredCategories,
    categories,
    resetFilters,
    filterboxAnchorEl,
    setFilterboxAnchorEl,
    hideExcludedEntries,
    removeFromExcluded,
    entriesMarkedAsExcluded,
  } = useFilterContext();

  return (
    <div
      style={{
        display: 'flex',
        width: '25%',
      }}
      className={styles.filterDiv}
    >
      <Button
        onClick={(e) => setFilterboxAnchorEl(e.currentTarget)}
        className={styles.filterboxButton}
        variant='outlined'
        startIcon={<FilterListIcon />}
        sx={{
          color: 'white',
          padding: '10px',
          minWidth: '100px',
          height: '2.5rem',
          marginBlock: 'auto',
        }}
      >
        FILTER
      </Button>

      <Popover
        id={'simple-popover'}
        open={Boolean(filterboxAnchorEl)}
        anchorEl={filterboxAnchorEl}
        onClose={() => setFilterboxAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div id={styles.filterbox}>
          <h3>Filters</h3>
          <div
            style={{
              display: 'flex',
              width: '100%',
            }}
          >
            <FormControlLabel
              control={<Checkbox checked={hideExcludedEntries} />}
              label='Hide excluded entries'
              sx={{ marginLeft: '15px' }}
              onChange={(e: React.SyntheticEvent, checked: boolean) =>
                filterEntries(checked, 'hideExcluded')
              }
            />
          </div>
          <ListOfExcludedEntriesDialog
            removeFromExcluded={removeFromExcluded}
            entriesMarkedAsExcluded={entriesMarkedAsExcluded}
          />

          <div
            style={{
              marginLeft: '15px',
              textAlign: 'center',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
            }}
          >
            <div
              style={{
                marginLeft: '15px',
                textAlign: 'center',
              }}
            >
              <FormControl sx={{ display: 'flex' }}>
                <FormLabel
                  sx={{
                    display: 'flex',
                  }}
                >
                  Filter by Canonicity
                </FormLabel>
                <RadioGroup
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                  }}
                  row
                  aria-labelledby='radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={canonicityFilterValue}
                  onChange={(e) => {
                    filterEntries(e.target.value, 'canonicity');
                  }}
                >
                  <FormControlLabel
                    value='all'
                    control={<Radio />}
                    label='All'
                  />
                  <FormControlLabel
                    value='legends'
                    control={<Radio />}
                    label='Legends'
                  />
                  <FormControlLabel
                    value='canon'
                    control={<Radio />}
                    label='Canon'
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div
              style={{
                marginLeft: '15px',
                textAlign: 'center',
              }}
            >
              <FormControl sx={{ display: 'flex' }}>
                <FormLabel
                  sx={{
                    display: 'flex',
                  }}
                >
                  Filter by Finished
                </FormLabel>
                <RadioGroup
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                  }}
                  row
                  aria-labelledby='radio-buttons-group-label'
                  name='row-radio-buttons-group'
                  value={finishedFilterValue}
                  onChange={(e) => {
                    filterEntries(e.target.value, 'finished');
                  }}
                >
                  <FormControlLabel
                    value='all'
                    control={<Radio />}
                    label='All'
                  />
                  <FormControlLabel
                    value='finished'
                    control={<Radio />}
                    label='Finished'
                  />
                  <FormControlLabel
                    value='unfinished'
                    control={<Radio />}
                    label='Unfinished'
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div>
            <FormControl
              sx={{ m: 1, width: 500, maxWidth: '80vw', minWidth: 'none' }}
              className={styles.filterchecklist}
            >
              <InputLabel>Creators</InputLabel>
              <Select
                multiple
                value={filteredCreatorsName}
                onChange={(e) => {
                  filterEntries(e.target.value, 'creators');
                }}
                input={<OutlinedInput label='Creators' />}
                renderValue={(selected) => selected.join(', ')}
              >
                {creators.map((name: string) => (
                  <MenuItem key={name} value={name} sx={{ maxWidth: '80vw' }}>
                    <Checkbox
                      checked={filteredCreatorsName.indexOf(name) > -1}
                    />
                    <ListItemText primary={name} sx={{ maxWidth: '80vw' }} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {categories.length ? (
            <div>
              <FormControl
                sx={{ m: 1, width: 500, maxWidth: '80vw', minWidth: 'none' }}
              >
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={filteredCategories}
                  onChange={(e) => {
                    filterEntries(e.target.value, 'categories');
                  }}
                  input={<OutlinedInput label='Categories' />}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {categories.map((name: string) => (
                    <MenuItem key={name} value={name} sx={{ maxWidth: '80vw' }}>
                      <Checkbox
                        checked={filteredCategories.indexOf(name) > -1}
                      />
                      <ListItemText primary={name} sx={{ maxWidth: '80vw' }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : null}
          <div
            style={{ width: '100%', textAlign: 'center' }}
            id={styles.filterResetBtnContainer}
          >
            <Button variant='contained' onClick={resetFilters}>
              <HistoryIcon /> Reset
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}
