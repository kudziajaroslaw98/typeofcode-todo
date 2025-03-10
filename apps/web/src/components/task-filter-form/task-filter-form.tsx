import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { TaskFilters } from "@/types/task-filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const taskFilterSchema = z.object({
  showDoneTasks: z.boolean().default(true),
  sortBy: z.enum(["CREATED_AT", "TITLE", "STATE", "DONE", "TIME_SPENT"]).default("CREATED_AT"),
  sortDirection: z.enum(["ASC", "DESC"]).default("DESC"),
  filterByState: z.enum(["ALL", "TODO", "DOING", "DONE"]).default("ALL"),
  filterByTitle: z.string().optional(),
  filterByDateFrom: z.string().optional(),
  filterByDateTo: z.string().optional(),
});

type TaskFilterValues = z.infer<typeof taskFilterSchema>;

type TaskFilterFormProps = {
  initialFilters?: Partial<TaskFilters>;
  onApplyFilters: (filters: TaskFilters) => void;
  onResetFilters: () => void;
};

const TaskFilterForm: React.FC<TaskFilterFormProps> = ({ initialFilters, onApplyFilters, onResetFilters }) => {
  const defaultValues: TaskFilterValues = {
    showDoneTasks: initialFilters?.showDoneTasks ?? true,
    sortBy: initialFilters?.sortBy ?? "CREATED_AT",
    sortDirection: initialFilters?.sortDirection ?? "DESC",
    filterByState: initialFilters?.filterByState ?? "ALL",
    filterByTitle: initialFilters?.filterByTitle,
    filterByDateFrom: initialFilters?.filterByDateFrom,
    filterByDateTo: initialFilters?.filterByDateTo,
  };

  const { register, handleSubmit, control, reset } = useForm<TaskFilterValues>({
    resolver: zodResolver(taskFilterSchema),
    defaultValues,
  });

  const handleReset = () => {
    reset(defaultValues);

    onResetFilters();
  };

  const handleFormSubmit = (data: TaskFilterValues) => {
    onApplyFilters(data as TaskFilters);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm text-zinc-600">Display Options</h3>

        <div className="flex items-center space-x-2">
          <Controller
            name="showDoneTasks"
            control={control}
            render={({ field }) => <Checkbox id="showDoneTasks" data-testid="filter-show-done" checked={field.value} onCheckedChange={field.onChange} />}
          />

          <Label htmlFor="showDoneTasks">Show completed tasks</Label>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-sm text-zinc-600">Sort</h3>

        <div className="grid grid-cols-2 gap-4">
          <div data-testid="filter-select-sort-by" className="flex flex-col gap-2">
            <Label htmlFor="sortBy">Sort by</Label>

            <Controller
              name="sortBy"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="CREATED_AT">Date created</SelectItem>
                    <SelectItem value="TIME_SPENT">Time spent</SelectItem>
                    <SelectItem value="TITLE">Title</SelectItem>
                    <SelectItem value="STATE">State</SelectItem>
                    <SelectItem value="DONE">Completion</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div data-testid="filter-select-sort-direction" className="flex flex-col gap-2">
            <Label htmlFor="sortDirection">Direction</Label>

            <Controller
              name="sortDirection"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="sortDirection">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ASC">Ascending</SelectItem>
                    <SelectItem value="DESC">Descending</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <h3 className="font-medium text-sm text-zinc-600">Filter</h3>

        <div data-testid="filter-select-state" className="flex flex-col gap-2">
          <Label htmlFor="filterByState">Status</Label>

          <Controller
            name="filterByState"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="filterByState">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All states</SelectItem>
                  <SelectItem value="TODO">TODO</SelectItem>
                  <SelectItem value="DOING">DOING</SelectItem>
                  <SelectItem value="DONE">DONE</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filterByTitle">Title contains</Label>

          <Input id="filterByTitle" placeholder="Search by title..." {...register("filterByTitle")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Created between</Label>

          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="filterByDateFrom"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  placeholder="From date"
                  data-testid="filter-title"
                  value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="filterByDateTo"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  placeholder="To date"
                  value={field.value ? new Date(field.value).toISOString().slice(0, 10) : ""}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" onClick={handleReset} variant="outline" size="sm">
          Reset
        </Button>

        <Button type="submit" size="sm">
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default TaskFilterForm;
