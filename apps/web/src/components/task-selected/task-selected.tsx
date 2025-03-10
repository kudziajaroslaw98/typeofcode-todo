import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

export const TaskSelected = ({
  selected,
  setSelected,
  onRemoveSelected,
}: {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  onRemoveSelected: () => void;
}) => {
  const handleDeleteSelected = () => {
    onRemoveSelected();
  };

  const handleClearSelected = () => {
    setSelected([]);
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="ml-16 text-sm flex gap-4 items-center">
          <span>Selected: {selected.length}</span>

          <span>|</span>

          <Button size={"xs"} variant={"secondary"} onClick={handleClearSelected}>
            Clear
          </Button>

          <Button size={"xs"} variant={"destructive"} onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};
