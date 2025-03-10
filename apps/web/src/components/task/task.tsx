import { TaskForm } from "@/components/task-form/task-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useAppState } from "@/providers/app-state/use-app-state";
import type { Task } from "@/types/task";
import { Check, Pause, Pencil, Play } from "lucide-react";
import { useEffect, useState } from "react";

export const TaskComponent = ({ task, onSelect, selected }: { task: Task; onSelect: (task: Task) => void; selected: (task: Task) => boolean }) => {
  const [workedTimeText, setWorkedTimeText] = useState("");
  const { toggleDone, toggleTaskSession, updateTask } = useAppState();

  const handleOnToggle = () => {
    toggleDone(task);
  };

  const handleOnPlay = (turnedOn: boolean) => {
    toggleTaskSession(turnedOn, task);
  };

  const handleEditTask = (task: Pick<Task, "title" | "state" | "description"> & Partial<Omit<Task, "title" | "state" | "description">>) => {
    updateTask(task);
  };

  const handleSelect = () => {
    if (task && onSelect) onSelect(task);
  };

  useEffect(() => {
    const seconds = task.timeSpent % 60;
    if (task.timeSpent < 60) {
      setWorkedTimeText(`Spent: ${seconds.toString().padStart(2, "0")}s`);
    } else {
      const minutes = Math.floor((task.timeSpent - seconds) / 60);
      setWorkedTimeText(`Spent: ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`);
    }
  }, [task.timeSpent]);

  return (
    <div className="w-full flex gap-4">
      <Checkbox
        onClick={handleSelect}
        className="flex justify-center items-center mt-4 size-6! dark:data-[state=checked]:bg-zinc-800"
        checked={selected(task)}
      />

      <div
        key={task.id}
        className={cn([
          "flex flex-col gap-4 p-4 px-4 w-full h-auto transition-transform rounded-md bg-linear-240 z-10 border border-zinc-900",
          task.done ? "blur-[.8px] z-0! to-zinc-950 from-zinc-950" : "to-zinc-950 from-zinc-900",
        ])}
      >
        <div className="w-full flex justify-between gap-4">
          <div className="flex gap-4">
            {!task.done && (
              <Toggle
                data-testid="task-play-button"
                variant={"primary"}
                size={"sm"}
                pressed={task.state === "DOING"}
                onPressedChange={handleOnPlay}
                className="flex justify-center items-center size-6!"
              >
                {task.state === "TODO" && <Play className="size-4!" />}
                {task.state === "DOING" && <Pause className="size-4!" />}
              </Toggle>
            )}

            {(task.done || task.state === "DOING") && (
              <Button
                variant={"secondary"}
                aria-checked={task.done}
                data-testid="task-done-button"
                size={"sm"}
                onClick={handleOnToggle}
                className="size-6! p-2!"
              >
                <Check className="size-4!" />
              </Button>
            )}
          </div>

          <div className="flex w-full gap-2 md:flex-row-reverse md:justify-between flex-col">
            <div className="flex gap-2 justify-end">
              {task.timeSpent > 0 && (
                <Badge variant={"outline"} data-testid="task-spent-time-badge" className="scale-75 h-6">
                  {workedTimeText}
                </Badge>
              )}

              <Badge
                data-testid="task-state-badge"
                variant={"outline"}
                className={cn([
                  "scale-75 h-6",
                  task.state === "TODO" && "text-zinc-400 border-zinc-600",
                  task.state === "DOING" && "text-blue-500 border-blue-500",
                  task.state === "DONE" && "text-zinc-800 border-zinc-800",
                ])}
              >
                {task.state === "TODO" && "Not Started"}
                {task.state === "DOING" && "In Progress"}
                {task.state === "DONE" && "Finished"}
              </Badge>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" data-testid="task-edit-button" className="size-6! p-2!" disabled={task.done}>
                    <Pencil className={cn(["size-4!", task.done ? "text-zinc-800" : "text-zinc-500"])} />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <TaskForm initialData={task} onSubmit={handleEditTask} />
                </PopoverContent>
              </Popover>
            </div>

            <div data-testid="task-body-lg" className="md:flex flex-col gap-1 justify-center hidden">
              <span className={cn(["transition-all font-medium md:font-semibold", task.done ? "line-through text-zinc-600" : ""])}>{task.title}</span>

              {task.description && (
                <span className={cn(["transition-all", task.done ? "line-through text-zinc-800" : "text-zinc-500"])}>{task.description}</span>
              )}
            </div>
          </div>
        </div>

        <div data-testid="task-body-sm" className="md:hidden flex-col gap-1 justify-center flex">
          <span className={cn(["transition-all font-medium md:font-semibold", task.done ? "line-through text-zinc-600" : ""])}>{task.title}</span>

          {task.description && <span className={cn(["transition-all", task.done ? "line-through text-zinc-800" : "text-zinc-500"])}>{task.description}</span>}
        </div>
      </div>
    </div>
  );
};
