import { Test } from '@nestjs/testing';
import type { DeleteResponseDto } from '../dto/delete-response.dto';
import { SortBy } from '../enums/sort-by.enum';
import { SortDirection } from '../enums/sort-direction.enum';
import { TaskFilterInput } from '../inputs/task-filter.input';
import { TaskInput } from '../inputs/task.input';
import { TasksResolver } from '../tasks.resolver';
import { TasksService } from '../tasks.service';

describe('TasksResolver', () => {
  let resolver: TasksResolver;
  const mockTasksService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeBatch: jest.fn(),
    removeAll: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksResolver,
        { provide: TasksService, useValue: mockTasksService },
      ],
    }).compile();

    resolver = module.get<TasksResolver>(TasksResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('task', () => {
    it('should fetch a single task by ID', async () => {
      const mockTask = { _id: '1', title: 'Test Task' };
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await resolver.task('1');
      expect(result).toEqual(mockTask);
      expect(mockTasksService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('tasks', () => {
    it('should fetch tasks with filter', async () => {
      const filter: TaskFilterInput = {
        showDoneTasks: false,
        sortBy: SortBy.CREATED_AT,
        sortDirection: SortDirection.DESC,
      };
      const mockTasks = [{ _id: '1', title: 'Test Task' }];
      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await resolver.tasks(filter);
      expect(result).toEqual(mockTasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith(filter);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const input: TaskInput = { title: 'New Task', done: false };
      const mockTask = { _id: '1', ...input };
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await resolver.createTask(input);
      expect(result).toEqual(mockTask);
      expect(mockTasksService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const input: TaskInput = { title: 'Updated Task', done: true };
      const mockTask = { _id: '1', ...input };
      mockTasksService.update.mockResolvedValue(mockTask);

      const result = await resolver.updateTask('1', input);
      expect(result).toEqual(mockTask);
      expect(mockTasksService.update).toHaveBeenCalledWith('1', input);
    });
  });

  describe('removeTask', () => {
    it('should delete a task', async () => {
      const mockTask = { _id: '1', title: 'Test Task' };
      mockTasksService.remove.mockResolvedValue(mockTask);

      const result = await resolver.removeTask('1');
      expect(result).toEqual(mockTask);
      expect(mockTasksService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('removeTasks', () => {
    it('should delete multiple tasks', async () => {
      const ids = ['1', '2'];
      const mockResult = { deletedCount: 'ala' };
      mockTasksService.removeBatch.mockResolvedValue(mockResult);

      const result = await resolver.removeTasks(ids);
      expect(result).toEqual(mockResult);
      expect(mockTasksService.removeBatch).toHaveBeenCalledWith(ids);
    });
  });

  describe('removeAllTasks', () => {
    it('should delete all tasks', async () => {
      const mockResult = { acknowledged: true, deletedCount: 5 };
      const expectedResponse: DeleteResponseDto = {
        acknowledged: true,
        deletedCount: 5,
      };
      mockTasksService.removeAll.mockResolvedValue(mockResult);

      const result = await resolver.removeAllTasks();
      expect(result).toEqual(expectedResponse);
      expect(mockTasksService.removeAll).toHaveBeenCalled();
    });
  });
});
