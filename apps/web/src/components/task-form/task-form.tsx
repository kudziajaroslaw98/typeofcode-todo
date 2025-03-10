import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  state: z.enum(["TODO", "DOING", "DONE"]),
  description: z.string().optional(),
});

type TaskFormProps = {
  initialData?: Task;
  onSubmit: (data: Pick<Task, "title" | "state" | "description"> & Partial<Omit<Task, "title" | "state" | "description">>) => void;
};

export function TaskForm({ initialData, onSubmit }: TaskFormProps) {
  const defaultValues: Pick<Task, "title" | "state" | "description"> = {
    title: initialData?.title ?? "",
    state: initialData?.state ?? "TODO",
    description: initialData?.description ?? "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Pick<Task, "title" | "state" | "description">>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const onSubmitHandler = (data: Pick<Task, "title" | "state" | "description">) => {
    onSubmit({ ...initialData, ...data });
  };
  return (
    <div className="space-y-6 w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
            Title
          </Label>
          <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        {/* State Select */}
        <div className="space-y-2">
          <Label htmlFor="state" className={errors.state ? "text-red-500" : ""}>
            State
          </Label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="state" className={errors.state ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">Not Started</SelectItem>
                  <SelectItem value="DOING">In Progress</SelectItem>
                  <SelectItem value="DONE">Finished</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" {...register("description")} placeholder="Add details about this task..." className="min-h-24" />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : initialData ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </div>
  );
}
