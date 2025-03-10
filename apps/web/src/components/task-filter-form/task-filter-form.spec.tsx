import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import TaskFilterForm from "./task-filter-form";

describe("TaskFilterForm", () => {
  const mockOnApplyFilters = jest.fn();
  const mockOnResetFilters = jest.fn();
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  const initialFilters = {
    showDoneTasks: true,
    sortBy: "CREATED_AT" as const,
    sortDirection: "DESC" as const,
    filterByState: "ALL" as const,
    filterByTitle: "",
    filterByDateFrom: undefined,
    filterByDateTo: undefined,
  };

  const ids = {
    showDone: "filter-show-done",
    sortBy: "filter-select-sort-by",
    sortDirection: "filter-select-sort-direction",
    filterByState: "filter-select-state",
    filterByTitle: "filter-title",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default values", () => {
    render(<TaskFilterForm initialFilters={initialFilters} onApplyFilters={mockOnApplyFilters} onResetFilters={mockOnResetFilters} />);

    expect(screen.getByText("Display Options")).toBeInTheDocument();
    expect(screen.getByText("Sort")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByLabelText("Show completed tasks")).toBeInTheDocument();

    expect(screen.getByTestId(ids.showDone).dataset.state).toBe("checked");
    expect(screen.getByTestId(ids.sortBy).querySelector("option[selected]")).toHaveTextContent("Date created");
    expect(screen.getByTestId(ids.sortDirection).querySelector("option[selected]")).toHaveTextContent("Descending");
    expect(screen.getByTestId(ids.filterByState).querySelector("option[selected]")).toHaveTextContent("All states");
    expect(screen.getByPlaceholderText("Search by title...")).toBeInTheDocument();
  });

  it("send filters when form is submitted", async () => {
    render(<TaskFilterForm initialFilters={initialFilters} onApplyFilters={mockOnApplyFilters} onResetFilters={mockOnResetFilters} />);

    // Fill in some filter values
    const titleInput = screen.getByPlaceholderText("Search by title...");
    fireEvent.change(titleInput, { target: { value: "Test" } });

    // Submit the form
    const applyButton = screen.getByRole("button", { name: /apply filters/i });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnApplyFilters).toHaveBeenCalled();
      expect(mockOnApplyFilters).toHaveBeenCalledWith({ ...initialFilters, filterByTitle: "Test" });
    });
  });

  it("send initial filters when reset button is clicked", () => {
    render(<TaskFilterForm initialFilters={initialFilters} onApplyFilters={mockOnApplyFilters} onResetFilters={mockOnResetFilters} />);

    const resetButton = screen.getByRole("button", { name: /reset/i });
    fireEvent.click(resetButton);

    expect(mockOnResetFilters).toHaveBeenCalled();
  });
});
