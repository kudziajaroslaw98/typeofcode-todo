import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import type { Model } from 'mongoose';
import { SortBy } from '../enums/sort-by.enum';
import { SortDirection } from '../enums/sort-direction.enum';
import type { TaskFilterInput } from '../inputs/task-filter.input';
import { Task } from '../schemas/task.schema';
import { TasksService } from '../tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: Model<Task>;

  const mockTaskModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task.name),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
    service = new TasksService(taskModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should apply filters correctly', async () => {
      const filter: TaskFilterInput = {
        showDoneTasks: false,
        filterByTitle: 'test',
        filterByDateFrom: new Date('2024-01-01'),
        filterByDateTo: new Date('2024-01-31'),
        sortBy: SortBy.TITLE,
        sortDirection: SortDirection.ASC,
      };

      const mockExec = { sort: jest.fn().mockReturnThis(), exec: jest.fn() };
      mockTaskModel.find.mockReturnValue(mockExec);
      mockExec.exec.mockResolvedValue([{ _id: '1', title: 'Test Task' }]);

      await service.findAll(filter);

      expect(mockTaskModel.find).toHaveBeenCalledWith({
        done: false,
        title: { $regex: 'test', $options: 'i' },
        createdAt: {
          $gte: new Date('2024-01-01'),
          $lte: new Date('2024-01-31'),
        },
      });

      expect(mockExec.sort).toHaveBeenCalledWith({ title: 1 });
    });
  });

  describe('removeBatch', () => {
    it('should delete multiple tasks', async () => {
      const ids = ['1', '2'];
      const mockExec = { exec: jest.fn() };
      const dummyResult: unknown = { deletedCount: 2, acknowledged: true };
      mockTaskModel.deleteMany.mockReturnValue(mockExec);
      mockExec.exec.mockResolvedValue(dummyResult);

      const result = await service.removeBatch(ids);
      expect(result).toEqual(dummyResult);
      expect(mockTaskModel.deleteMany).toHaveBeenCalledWith({
        _id: { $in: ids },
      });
    });
  });

  describe('removeAll', () => {
    it('should delete all tasks', async () => {
      const dummyResult: unknown = { deletedCount: 2, acknowledged: true };
      const mockExec = { exec: jest.fn() };
      mockTaskModel.deleteMany.mockReturnValue(mockExec);
      const mockExecResult = mockExec.exec.mockResolvedValue(dummyResult);

      const result = await service.removeAll();
      expect(result).toEqual(dummyResult);
      expect(mockExecResult).toHaveBeenCalledTimes(1);
      expect(mockTaskModel.deleteMany).toHaveBeenCalledWith({});
    });
  });
});
