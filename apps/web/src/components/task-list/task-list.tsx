import { TaskComponent } from "@/components/task/task";
import { useAppState } from "@/providers/app-state/use-app-state";
import type { Task } from "@/types/task";
import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import { TaskSelected } from "../task-selected/task-selected";

const TaskList = () => {
  const { tasks, selected, setSelected, removeSelected } = useAppState();

  const isSelected = useCallback((task: Task) => selected.includes(task.id), [selected]);

  const handleOnTaskSelect = useCallback(
    (task: Task) => setSelected((prev) => (prev.includes(task.id) ? prev.filter((id) => id !== task.id) : [...prev, task.id])),
    [setSelected]
  );

  return (
    <div className="w-full flex-col flex py-4 pt-8">
      <TaskSelected selected={selected} setSelected={setSelected} onRemoveSelected={removeSelected} />

      <div className="max-w-4xl mx-auto p-4 w-full h-auto flex flex-col gap-1">
        {tasks.length === 0 && <span className="text-zinc-500">No tasks found</span>}

        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div layout key={task.id} className="z-0">
              <TaskComponent task={task} onSelect={handleOnTaskSelect} selected={isSelected} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;
