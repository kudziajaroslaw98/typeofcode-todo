export type TaskFilters = {
  showDoneTasks?: boolean;
  sortBy?: "CREATED_AT" | "TITLE" | "STATE" | "DONE";
  sortDirection?: "ASC" | "DESC";
  filterByState?: "ALL" | "TODO" | "DOING" | "DONE";
  filterByTitle?: string;
  filterByDateFrom?: string;
  filterByDateTo?: string;
};
