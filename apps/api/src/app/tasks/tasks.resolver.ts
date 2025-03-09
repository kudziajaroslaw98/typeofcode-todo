import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeleteResponseDto } from './dto/delete-response.dto';
import { TaskDto } from './dto/task.dto';
import { TaskFilterInput } from './inputs/task-filter.input';
import { TaskUpdateInput } from './inputs/task-update.input';
import { TaskInput } from './inputs/task.input';
import { TasksService } from './tasks.service';

@Resolver()
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => TaskDto)
  async task(@Args({ name: 'id', type: () => String }) id: string) {
    return this.tasksService.findOne(id);
  }

  @Query(() => [TaskDto])
  async tasks(
    @Args({ name: 'filter', type: () => TaskFilterInput, nullable: true })
    filter?: TaskFilterInput,
  ) {
    return this.tasksService.findAll(filter);
  }

  @Mutation(() => TaskDto)
  async createTask(
    @Args({ name: 'input', type: () => TaskInput }) input: TaskInput,
  ) {
    return this.tasksService.create(input);
  }

  @Mutation(() => TaskDto)
  async updateTask(
    @Args({ name: 'id', type: () => String }) id: string,
    @Args({ name: 'input', type: () => TaskUpdateInput })
    input: TaskUpdateInput,
  ) {
    return this.tasksService.update(id, input);
  }

  @Mutation(() => DeleteResponseDto)
  async removeTask(@Args({ name: 'id', type: () => String }) id: string) {
    return this.tasksService.remove(id);
  }

  @Mutation(() => DeleteResponseDto)
  async removeTasks(
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ) {
    return this.tasksService.removeBatch(ids);
  }

  @Mutation(() => DeleteResponseDto)
  async removeAllTasks() {
    return this.tasksService.removeAll();
  }
}
