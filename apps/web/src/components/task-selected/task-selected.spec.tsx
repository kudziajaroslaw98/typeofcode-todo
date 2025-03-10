import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { TaskSelected } from "./task-selected";

describe("TaskSelected", () => {
  const mockSetSelected = jest.fn();
  const removeSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no tasks are selected", () => {
    const { container } = render(<TaskSelected selected={[]} setSelected={mockSetSelected} onRemoveSelected={removeSelected} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("renders selection info when tasks are selected", () => {
    render(<TaskSelected selected={["1", "2"]} setSelected={mockSetSelected} onRemoveSelected={removeSelected} />);

    expect(screen.getByText("Selected: 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete Selected" })).toBeInTheDocument();
  });

  it("clears selection when clear button is clicked", () => {
    render(<TaskSelected selected={["1", "2"]} setSelected={mockSetSelected} onRemoveSelected={removeSelected} />);

    const clearButton = screen.getByRole("button", { name: "Clear" });
    fireEvent.click(clearButton);

    expect(mockSetSelected).toHaveBeenCalledWith([]);
  });
});
