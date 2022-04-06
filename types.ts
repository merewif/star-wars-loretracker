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
