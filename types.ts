export type PossibleModules = 'movies' | 'books' | 'comics' | 'series';

export interface CardProps {
  moduleKeys: string[];
  e1: EntryData;
  excludeEntry: (entry: string) => void;
  entriesMarkedAsFinished: MarkedEntries;
  toggleEntryAsFinished: (entry: EntryData) => void;
  currentlyOpenedModule: string;
  currentTitle: string;
  getDescription: Function
}

export interface HeadProps {
  module: PossibleModules;
}

export interface SnackbarProps {
  openSnackbar: boolean;
  closeSnackbar: (
    event: React.MouseEventHandler<HTMLAnchorElement>,
    reason: string
  ) => void;
}

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

export interface YoutiniData {
  '(All Books) Title + Format': string;
  'Database ID': number;
  'Name (Title)': string;
  'Author / Writer': string;
  'Release Date': string;
  Timeline: string;
  'Cover Image URL': string | number;
  Category: string;
  canonicity: boolean;
}

export interface EntryData {
  canonicity: boolean;
  coverImage: string | number | undefined;
  title: string;
  author?: string;
  releaseDate?: any;
  timeline?: number | string;
  category?: string;
  directedBy?: string;
  createdBy?: string;
  yearOfRelease?: string | number;
  era?: string;
  seasons?: string | number;
  episodes?: string | number;
  links?: any;
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

export interface LoginProps {
  handleClose: () => void;
}

export interface AboutProps {
  handleClose: () => void;
  uploadBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  downloadBackup: () => void;
}

export interface DescriptionDialogProps {
  title: string;
  description: string;
}
