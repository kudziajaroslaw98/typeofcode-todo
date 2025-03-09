import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import type { Model } from 'mongoose';
import type { TaskDto } from '../dto/task.dto';
import { SortBy } from '../enums/sort-by.enum';
import { SortDirection } from '../enums/sort-direction.enum';
import { TaskState } from '../enums/task-state.enum';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../helpers/mongo-memory-server';
import type { TaskInput } from '../inputs/task.input';
import { Task, TaskSchema } from '../schemas/task.schema';
import { TasksService } from '../tasks.service';

describe('Tasks (e2e)', () => {
  let tasksService: TasksService;
  let testingModule: TestingModule;
  let taskModel: Model<Task>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TasksService],
    }).compile();

    tasksService = testingModule.get<TasksService>(TasksService);

    taskModel = testingModule.get<Model<Task>>(getModelToken(Task.name));
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  describe('tasksService', () => {
    afterEach(async () => {
      await taskModel.deleteMany({}).exec();
    });

    it('should be defined', () => {
      expect(tasksService).toBeDefined();
    });

    it('should create a task', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const task: TaskDto = (await tasksService.create(input)) as TaskDto;

      expect(task).toBeDefined();
      expect(task.title).toBe(input.title);
      expect(task.done).toBe(input.done);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
      expect(task.id).toBeDefined();

      const tasks: TaskDto[] = (await tasksService.findAll()) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe(input.title);
      expect(tasks[0].done).toBe(input.done);
      expect(tasks[0].id).toBe(task.id);
    });

    it('should find a task', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const task: TaskDto = (await tasksService.create(input)) as TaskDto;

      expect(task).toBeDefined();

      const foundTask: TaskDto = (await tasksService.findOne(
        task.id,
      )) as TaskDto;

      expect(foundTask).toBeDefined();
      expect(foundTask.title).toBe(input.title);
      expect(foundTask.done).toBe(input.done);
      expect(foundTask.id).toBe(task.id);
    });

    it('should find all tasks', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      for (let i = 0; i < 5; i++) {
        await tasksService.create(input);
      }

      const tasks: TaskDto[] = (await tasksService.findAll()) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(5);
    });

    it('should find all tasks with filters', async () => {
      for (let i = 0; i < 5; i++) {
        await tasksService.create({
          title: `New Task ${i}`,
          timeSpent: i,
          description: `Description ${i}`,
          state: i % 2 === 0 ? TaskState.TODO : TaskState.DONE,
          done: i % 2 === 0,
        });
      }

      let tasks: TaskDto[] = (await tasksService.findAll({
        showDoneTasks: false,
      })) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(2);

      tasks = (await tasksService.findAll({
        filterByTitle: 'New Task 1',
      })) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(1);

      tasks = (await tasksService.findAll({
        sortBy: SortBy.TIME_SPENT,
        sortDirection: SortDirection.ASC,
      })) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(5);

      tasks.forEach((task, index) => {
        expect(task.timeSpent).toBeDefined();
        expect(task.timeSpent).toBe(index);
      });

      tasks = (await tasksService.findAll({
        filterByTitle: 'New Task 2',
        showDoneTasks: false,
      })) as TaskDto[];

      expect(tasks).toBeDefined();
      expect(tasks.length).toBe(0);
    });

    it('should update a task', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const task: TaskDto = (await tasksService.create(input)) as TaskDto;
      let updatedTask: TaskDto = (await tasksService.update(task.id, {
        title: 'Updated Task',
      })) as TaskDto;

      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).toBe('Updated Task');

      updatedTask = (await tasksService.update(task.id, {
        title: 'Updated Task2',
        done: true,
        timeSpent: 10,
        description: 'Updated description',
      })) as TaskDto;

      expect(updatedTask).toBeDefined();
      expect(updatedTask.title).not.toBe('Updated Task');
      expect(updatedTask.title).toBe('Updated Task2');
      expect(updatedTask.done).toBe(true);
      expect(updatedTask.timeSpent).toBe(10);
      expect(updatedTask.description).toBe('Updated description');
    });

    it('should delete a task', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const task: TaskDto = (await tasksService.create(input)) as TaskDto;

      const result = await tasksService.remove(task.id);

      expect(result.deletedCount).toBe(1);
      expect(result.acknowledged).toBe(true);

      const deletedTask = await tasksService.findOne(task.id);
      expect(deletedTask).toBeNull();
    });

    it('should delete multiple tasks', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const task: TaskDto = (await tasksService.create(input)) as TaskDto;
      const task2: TaskDto = (await tasksService.create(input)) as TaskDto;
      const task3: TaskDto = (await tasksService.create(input)) as TaskDto;
      const task4: TaskDto = (await tasksService.create(input)) as TaskDto;
      const task5: TaskDto = (await tasksService.create(input)) as TaskDto;

      const result = await tasksService.removeBatch([
        task.id,
        task2.id,
        task3.id,
        task4.id,
        task5.id,
      ]);

      expect(result.deletedCount).toBe(5);
      expect(result.acknowledged).toBe(true);

      const deletedTask = await tasksService.findAll();

      expect(deletedTask).toStrictEqual([]);
    });

    it('should delete all tasks', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      for (let i = 0; i < 5; i++) {
        await tasksService.create(input);
      }

      const result = await tasksService.removeAll();

      expect(result.deletedCount).toBe(5);
      expect(result.acknowledged).toBe(true);

      const deletedTask = await taskModel.find({});
      expect(deletedTask).toStrictEqual([]);
    });
  });
});
