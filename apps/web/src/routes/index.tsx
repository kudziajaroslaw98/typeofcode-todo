import TaskFilterForm from "@/components/task-filter-form/task-filter-form";
import { TaskForm } from "@/components/task-form/task-form";
import TaskList from "@/components/task-list/task-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppState } from "@/providers/app-state/use-app-state";
import type { Task } from "@/types/task";
import type { TaskFilters } from "@/types/task-filters";
import { createFileRoute } from "@tanstack/react-router";
import { Filter, MoreHorizontal, Plus } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { taskFilters, newTask, updateTask, updateFilters, removeAll } = useAppState();

  const handleNewTask = (data: Pick<Task, "title" | "state" | "description"> & Partial<Omit<Task, "title" | "state" | "description">>) => {
    if (!data) return;

    if (!data.id) {
      newTask(data);
    } else {
      updateTask(data);
    }
  };

  const handleFiltersChange = (filters?: TaskFilters) => {
    updateFilters(filters ?? {});
  };

  const handleRemoveAll = () => {
    removeAll();
  };

  return (
    <div className="pt-12 w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl flex flex-col justify-center items-center">
        <span className="font-bold text-xl">Your Tasks</span>

        <div className="w-full flex justify-end px-8 gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button size={"sm"} data-testid="filters-button" variant={"outline"} className="flex gap-4">
                <Filter className="size-4" />
                <span>Filters</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <TaskFilterForm initialFilters={taskFilters} onApplyFilters={handleFiltersChange} onResetFilters={handleFiltersChange} />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button size={"sm"} data-testid="actions-button" variant={"outline"} className="flex gap-4">
                <MoreHorizontal className="size-4" />
                <span>Actions</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem variant={"destructive"} data-testid="delete-all-button" onClick={handleRemoveAll}>
                Delete All Tasks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <TaskList />
        </Suspense>

        <div className="sticky bottom-4 w-full py-2 flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size={"sm"} data-testid="add-task-button" variant={"secondary"}>
                <Plus className="size-4" />
                Add Task
              </Button>
            </PopoverTrigger>

            <PopoverContent>
              <TaskForm onSubmit={handleNewTask} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
