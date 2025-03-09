import { Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, default: false })
  done: boolean;

  @Prop({ enum: ['TODO', 'DOING', 'DONE'], required: true, default: 'TODO' })
  state: 'TODO' | 'DOING' | 'DONE';

  @Prop()
  startedAt: Date;

  @Prop(Int)
  timeSpent: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ title: 'text' }); // Text index for title search
TaskSchema.index({ createdAt: -1 }); // Index for sorting by creation date
TaskSchema.index({ state: 1 }); // Index for filtering by state
TaskSchema.index({ done: 1 });
