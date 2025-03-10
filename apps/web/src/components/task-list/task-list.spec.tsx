import AppStateProvider from "@/providers/app-state/app-state";
import { MockedProvider } from "@apollo/client/testing";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TaskList from "./task-list";

// Mock AnimatePresence and motion.div
jest.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
  },
}));

describe("TaskList", () => {
  const mockTasks = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      state: "TODO" as const,
      done: false,
      timeSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: null,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      state: "DOING" as const,
      done: false,
      timeSpent: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    },
  ];

  it("renders the task list with tasks", () => {
    render(
      <MockedProvider>
        <AppStateProvider testInit={{ tasks: mockTasks, selected: [], taskFilters: {} }}>
          <TaskList />
        </AppStateProvider>
      </MockedProvider>
    );

    //   we have 2 divs with texts in dom for mobile + desktop so we check length
    expect(screen.getAllByText("Task 1")).toHaveLength(2);
    expect(screen.getAllByText("Description 1")).toHaveLength(2);
    expect(screen.getAllByText("Task 2")).toHaveLength(2);
    expect(screen.getAllByText("Description 2")).toHaveLength(2);
  });

  it("displays a message when no tasks are found", () => {
    // Override the mock for this test case
    render(
      <MockedProvider>
        <AppStateProvider testInit={{ tasks: [], selected: [], taskFilters: {} }}>
          <TaskList />
        </AppStateProvider>
      </MockedProvider>
    );

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });
});
