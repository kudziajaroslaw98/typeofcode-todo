import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { DeleteResult, FilterQuery, Model, SortOrder } from 'mongoose';
import { SortBy } from './enums/sort-by.enum';
import { SortDirection } from './enums/sort-direction.enum';
import { TaskState } from './enums/task-state.enum';
import type { TaskFilterInput } from './inputs/task-filter.input';
import type { TaskUpdateInput } from './inputs/task-update.input';
import { TaskInput } from './inputs/task.input';
import { Task, type TaskDocument } from './schemas/task.schema';
import type { DateRangeQuery } from './types/date-range-query';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(taskInput: TaskInput): Promise<Task> {
    const createdTask = new this.taskModel(taskInput);
    return createdTask.save();
  }

  async findAll(filter?: TaskFilterInput): Promise<Task[]> {
    const {
      showDoneTasks = true,
      sortBy = SortBy.CREATED_AT,
      sortDirection = SortDirection.DESC,
      filterByState = TaskState.ALL,
      filterByTitle = '',
      filterByDateFrom = null,
      filterByDateTo = null,
    } = filter || {};

    const query: FilterQuery<TaskDocument> = {};

    if (!showDoneTasks) {
      query.done = false;
    }

    if (filterByState !== TaskState.ALL) {
      query.state = filterByState;
    }

    if (filterByTitle) {
      query.title = { $regex: filterByTitle, $options: 'i' };
    }

    if (filterByDateFrom || filterByDateTo) {
      const dateQuery: DateRangeQuery = {};

      if (filterByDateFrom) {
        dateQuery.$gte = filterByDateFrom;
      }

      if (filterByDateTo) {
        dateQuery.$lte = filterByDateTo;
      }

      query.createdAt = dateQuery;
    }

    const sortConfig: Record<string, SortOrder> = {};
    sortConfig[sortBy] = sortDirection === SortDirection.ASC ? 1 : -1;

    // return this.taskModel.find().exec();
    return this.taskModel.find(query).sort(sortConfig).exec();
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskModel.findById(id).exec();
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.taskModel.deleteOne({ _id: id }).exec();
  }

  async removeBatch(ids: string[]): Promise<DeleteResult> {
    return this.taskModel.deleteMany({ _id: { $in: ids } }).exec();
  }

  async update(
    id: string,
    taskInput: Partial<TaskUpdateInput>,
  ): Promise<Task | null> {
    return this.taskModel.findByIdAndUpdate(id, taskInput, { new: true });
  }

  async removeAll(): Promise<DeleteResult> {
    return this.taskModel.deleteMany({}).exec();
  }
}
