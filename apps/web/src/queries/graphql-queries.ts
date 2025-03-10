import { gql } from "@apollo/client";

export const GET_TASKS = gql`
  query Tasks($filter: TaskFilterInput) {
    tasks(filter: $filter) {
      id
      title
      description
      done
      state
      startedAt
      timeSpent
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      done
      state
      startedAt
      timeSpent
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: String!, $input: TaskUpdateInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      done
      state
      startedAt
      timeSpent
      createdAt
    }
  }
`;

export const REMOVE_BATCH_TASKS = gql`
  mutation RemoveTasks($ids: [String!]!) {
    removeTasks(ids: $ids) {
      acknowledged
      deletedCount
    }
  }
`;

export const REMOVE_ALL_TASKS = gql`
  mutation {
    removeAllTasks {
      acknowledged
      deletedCount
    }
  }
`;
