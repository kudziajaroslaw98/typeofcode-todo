// TaskForm.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TaskForm } from "./task-form";

describe("TaskForm", () => {
  const mockOnSubmit = jest.fn();

  const initialData = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    state: "TODO" as const,
    done: false,
    timeSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with default values when no initialData", () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description (Optional)")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Create Task" })).toBeInTheDocument();
  });

  it("renders form with initialData values", () => {
    render(<TaskForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText("Title")).toHaveValue("Test Task");
    expect(screen.getByLabelText("Description (Optional)")).toHaveValue("Test Description");
    expect(screen.getByRole("button", { name: "Update Task" })).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText("Title");
    fireEvent.change(titleInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText("Title");
    fireEvent.change(titleInput, { target: { value: "New Task" } });

    const descriptionInput = screen.getByLabelText("Description (Optional)");
    fireEvent.change(descriptionInput, { target: { value: "New Description" } });

    const submitButton = screen.getByRole("button", { name: "Create Task" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: "New Task",
        state: "TODO",
        description: "New Description",
      });
    });
  });
});
