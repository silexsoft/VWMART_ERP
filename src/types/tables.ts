export type TableGenericProps = {
  columns: Array<any>;
  data: Array<any>;
  footer?: any | null;
  noDataMsg?: string | null;
  customClasses?: string | null;
  currentPage?: Number | null;
  pagesize?: Number | null;
};
