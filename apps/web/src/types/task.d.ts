export type Task = {
  id: string;
  title: string;
  done: boolean;
  state: "TODO" | "DOING" | "DONE";
  timeSpent: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  description?: string;
  startedAt?: Date | null | string;
};
