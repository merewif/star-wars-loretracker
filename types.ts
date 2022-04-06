export interface CardContentsProps {
  i2: number;
  currentKey: string;
  currentValue: string | number;
  excludeEntry: Function;
  currentTitle: string;
}

export interface HeaderProps {
  displayData: Function;
  handleFileRead: any;
}

export interface EntryData {
  canonicity: boolean;
  coverImage: string | number | undefined;
  title: string;
  author?: string;
  releaseDate?: any;
  timeline?: number | '';
  category?: string;
  directedBy?: string;
  createdBy?: string;
  yearOfRelease?: string | number;
  era?: string;
  seasons?: string | number;
  episodes?: string | number;
  links?: any;
  '(All Books) Title + Format'?: string;
  'Database ID'?: number;
  'Name (Title)'?: string;
  'Author / Writer'?: string;
  'Release Date'?: string;
  Timeline?: string;
  'Cover Image URL'?: string;
  Category?: string;
}

export interface MarkedEntries {
  [key: string]: any;
}

export interface Keyable {
  [key: string]: any;
}

export interface SortDropdownProps {
  sortBy: string;
  orderBy: Function;
  moduleKeys: string[];
}

export interface ProgressBarProps {
  progressBarValue: number;
}
