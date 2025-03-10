import { Task } from "@/types/task";
import { fireEvent, render, screen } from "@testing-library/react";
import { TaskComponent } from "./task";

describe("TaskComponent", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    state: "TODO",
    done: false,
    timeSpent: 75, // 1m 15s
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startedAt: null,
  };

  const mockOnSelect = jest.fn();
  const mockSelected = jest.fn().mockReturnValue(false);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the task correctly", () => {
    render(<TaskComponent task={mockTask} onSelect={mockOnSelect} selected={mockSelected} />);

    //   task-body-lg and task-body-sm are the same but visible on different screen sizes so we only check one
    expect(screen.getByTestId("task-body-lg")).toHaveTextContent("Test Task");
    expect(screen.getByTestId("task-body-lg")).toHaveTextContent("Test Description");
    expect(screen.getByText("Not Started")).toBeInTheDocument();
    expect(screen.getByText("Spent: 01m 15s")).toBeInTheDocument();
  });

  it("calls onSelect when checkbox is clicked", () => {
    render(<TaskComponent task={mockTask} onSelect={mockOnSelect} selected={mockSelected} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnSelect).toHaveBeenCalledWith(mockTask);
  });

  it("renders correct controls for a TODO task", () => {
    render(<TaskComponent task={mockTask} onSelect={mockOnSelect} selected={mockSelected} />);

    expect(screen.getByTestId("task-play-button").querySelector("svg")).toBeInTheDocument();
    expect(screen.getByTestId("task-play-button").querySelector("svg")).toHaveClass("lucide-play");
  });

  it("renders correct controls for a DOING task", () => {
    const doingTask = { ...mockTask, state: "DOING" as const };
    render(<TaskComponent task={doingTask} onSelect={mockOnSelect} selected={mockSelected} />);

    expect(screen.getByTestId("task-play-button").querySelector("svg")).toBeInTheDocument();
    expect(screen.getByTestId("task-play-button").querySelector("svg")).toHaveClass("lucide-pause");
  });

  it("renders correct UI for a DONE task", () => {
    const doneTask = {
      ...mockTask,
      state: "DONE" as const,
      done: true,
    };

    render(<TaskComponent task={doneTask} onSelect={mockOnSelect} selected={mockSelected} />);

    expect(screen.getByText("Finished")).toBeInTheDocument();
    expect(screen.getByTestId("task-done-button")).toBeInTheDocument();
    expect(screen.getByTestId("task-done-button")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByTestId("task-body-lg")).toHaveTextContent("Test Task");
    expect(screen.getByTestId("task-body-lg")).toHaveTextContent("Test Description");
    expect(screen.getByTestId("task-body-lg").querySelector("span:first-child")).toHaveClass("line-through");
    expect(screen.getByTestId("task-body-lg").querySelector("span:last-child")).toHaveClass("line-through");
  });
});
