import { handleClientErrors } from "@/helpers/handle-client-errors";
import { useMutation, useQuery } from "@apollo/client";
import type { GraphQLFormattedError } from "graphql/error/GraphQLError";
import { useEffect, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";
import { CREATE_TASK, GET_TASKS, REMOVE_ALL_TASKS, REMOVE_BATCH_TASKS, UPDATE_TASK } from "../../queries/graphql-queries";
import type { Task } from "../../types/task";
import type { TaskFilters } from "../../types/task-filters";
import { AppState } from "./app-state-context";

export type AppStateType = {
  tasks: Task[];
  selected: string[];
  tasksLoading: boolean;
  taskFilters: TaskFilters;
  setSelected: Dispatch<SetStateAction<string[]>>;
  toggleDone: (task: Task) => void;
  toggleTaskSession: (turnedOn: boolean, task: Task) => void;
  newTask: (data: Pick<Task, "title" | "state" | "description">) => void;
  updateTask: (data: Pick<Task, "title" | "state" | "description"> & Partial<Omit<Task, "title" | "state" | "description">>) => void;
  updateFilters: (filters: TaskFilters) => void;
  removeSelected: () => void;
  removeAll: () => void;
};

export default function AppStateProvider({ ...props }: PropsWithChildren<{ testInit?: { tasks: Task[]; selected: string[]; taskFilters: TaskFilters } }>) {
  /////////////////
  // #region STATE
  /////////////////

  const [tasks, setTasks] = useState<Task[]>(props.testInit?.tasks ?? []);
  const [selected, setSelected] = useState<string[]>(props.testInit?.selected ?? []);
  const [taskFilters, setTaskFilters] = useState<TaskFilters>(props.testInit?.taskFilters ?? {});
  const [updateTaskQuery] = useMutation(UPDATE_TASK);
  const [createTaskQuery] = useMutation(CREATE_TASK);
  const [deleteSelectedTaskQuery] = useMutation(REMOVE_BATCH_TASKS);
  const [deleteAllTaskQuery] = useMutation(REMOVE_ALL_TASKS);

  /////////////////
  // #endregion STATE
  /////////////////

  /////////////////
  // #region TASKS
  /////////////////

  const toggleDone = async (task: Task) => {
    if (!task) return;

    const done = !task.done;

    const taskCopy: Omit<Task, "id" | "updatedAt" | "createdAt"> = {
      title: task.title,
      done: done,
      timeSpent: task.timeSpent,
      description: task.description,
      startedAt: task.startedAt,
      state: done ? "DONE" : "TODO",
    };

    if (done && !!task.startedAt) {
      const miliSeconds = (new Date().getTime() - new Date(task.startedAt).getTime()) % 1000;
      taskCopy.timeSpent = Math.floor((new Date().getTime() - new Date(task.startedAt).getTime() - miliSeconds) / 1000);
      taskCopy.startedAt = null;
    }

    try {
      await updateTaskQuery({ variables: { id: task.id, input: taskCopy } });
      setTasks((prev) => prev.map((prevTask) => (prevTask.id === task.id ? { ...prevTask, ...taskCopy } : prevTask)));
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  const toggleTaskSession = async (turnedOn: boolean, task: Task) => {
    if (!task) return;

    const taskCopy: Omit<Task, "id" | "updatedAt" | "createdAt"> = {
      title: task.title,
      done: task.done,
      timeSpent: task.timeSpent,
      description: task.description,
      state: task.state,
      startedAt: task.startedAt,
    };

    if (turnedOn) {
      taskCopy.startedAt = new Date();
      taskCopy.state = "DOING";
    } else {
      if (task.startedAt) {
        const miliSeconds = (new Date().getTime() - new Date(task.startedAt).getTime()) % 1000;
        taskCopy.timeSpent = taskCopy.timeSpent + Math.floor((new Date().getTime() - new Date(task.startedAt).getTime() - miliSeconds) / 1000);
      }
      taskCopy.startedAt = null;
      taskCopy.state = "TODO";
    }

    try {
      await updateTaskQuery({ variables: { id: task.id, input: taskCopy } });
      setTasks((prev) => prev.map((prevTask) => (prevTask.id === task.id ? { ...prevTask, ...taskCopy } : prevTask)));
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  const newTask = async (data: Pick<Task, "title" | "state" | "description">) => {
    if (!data) return;

    const taskCopy: Omit<Task, "id"> = {
      title: data.title,
      state: data.state,
      description: data.description,
      done: data.state === "DONE" ? true : false,
      timeSpent: 0,
      startedAt: data.state === "DOING" ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const {
        data: { createTask },
      } = await createTaskQuery({ variables: { input: taskCopy } });
      setTasks((prev) => {
        return [...prev, createTask];
      });
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  const updateTask = async (data: Pick<Task, "title" | "state" | "description"> & Partial<Omit<Task, "title" | "state" | "description">>) => {
    if (!data) return;

    const taskCopy: Omit<Task, "id" | "updatedAt" | "createdAt"> = {
      title: data.title,
      state: data.state,
      description: data.description,
      done: data.state === "DONE" ? true : false,
      timeSpent: data.timeSpent ?? 0,
      startedAt: data.startedAt,
    };

    try {
      setTasks((prev) => prev.map((prevTask) => (prevTask.id === data.id ? { ...prevTask, ...taskCopy } : prevTask)));
      await updateTaskQuery({ variables: { id: data.id, input: taskCopy } });
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  const updateFilters = (filters: TaskFilters) => {
    setTaskFilters(filters);
  };

  const removeSelected = async () => {
    try {
      await deleteSelectedTaskQuery({ variables: { ids: selected } });
      setTasks((prev) => prev.filter((task) => !selected.includes(task.id)));
      setSelected([]);
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  const removeAll = async () => {
    try {
      await deleteAllTaskQuery({ variables: { ids: selected } });
      setTasks([]);
      setSelected([]);
    } catch (error) {
      handleClientErrors([error as GraphQLFormattedError]);
    }
  };

  /////////////////
  // #endregion TASKS
  /////////////////

  /////////////////
  // #region INIT
  /////////////////
  const {
    data: initTasks,
    refetch: refetchTasks,
    loading: tasksLoading,
    error: tasksError,
  } = useQuery(GET_TASKS, { variables: { filter: taskFilters }, nextFetchPolicy: "cache-and-network" });

  useEffect(() => {
    if (!initTasks) return;
    setTasks(initTasks.tasks);
  }, [initTasks]);

  useEffect(() => {
    if (!taskFilters) return;
    refetchTasks({ filter: taskFilters ?? {} }).then(({ errors, data }) => {
      if (errors) {
        handleClientErrors(errors);
      }

      if (data && data.tasks) {
        setTasks(data.tasks);
      }
    });
  }, [taskFilters]);

  useEffect(() => {
    if (!tasksError) return;
    console.error(tasksError.message);
    window.alert("Error: " + tasksError.message);
  }, [tasksError]);

  /////////////////
  // #endregion INIT
  /////////////////

  return (
    <AppState.Provider
      value={{
        tasks,
        taskFilters,
        tasksLoading,
        selected,
        setSelected,
        toggleDone,
        toggleTaskSession,
        newTask,
        updateTask,
        updateFilters,
        removeSelected,
        removeAll,
      }}
    >
      {props.children}
    </AppState.Provider>
  );
}
