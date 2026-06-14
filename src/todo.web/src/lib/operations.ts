import { gql } from "@apollo/client"

// ─── Todo fields fragment ─────────────────────────────────────────────────────

const TODO_FIELDS = gql`
  fragment TodoFields on Todo {
    id
    userId
    categoryId
    text
    completed
    createdAt
    dueDate
    price
    priority
    quantity
    store
    assignee
    team
    notes
    moodRating
    tags
    category {
      name
    }
    subtasks {
      id
      todoId
      text
      completed
      sortOrder
    }
  }
`

// ─── Queries ──────────────────────────────────────────────────────────────────

export const GET_TODOS = gql`
  ${TODO_FIELDS}
  query GetTodos($userId: UUID!) {
    todos(userId: $userId) {
      ...TodoFields
    }
  }
`

export const GET_BUDGET_ENTRIES = gql`
  query GetBudgetEntries($userId: UUID!) {
    budgetEntries(userId: $userId) {
      id
      userId
      type
      category
      amount
      description
      date
      createdAt
    }
  }
`

// ─── Todo mutations ───────────────────────────────────────────────────────────

export const CREATE_TODO = gql`
  ${TODO_FIELDS}
  mutation CreateTodo($input: CreateTodoInput!) {
    createTodo(input: $input) {
      ...TodoFields
    }
  }
`

export const UPDATE_TODO = gql`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      id
      completed
      text
      dueDate
      price
      priority
      quantity
      store
      assignee
      team
      notes
      moodRating
      tags
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: UUID!) {
    deleteTodo(id: $id)
  }
`

// ─── Subtask mutations ────────────────────────────────────────────────────────

export const ADD_SUBTASK = gql`
  mutation AddSubtask($input: AddSubtaskInput!) {
    addSubtask(input: $input) {
      id
      todoId
      text
      completed
      sortOrder
    }
  }
`

export const TOGGLE_SUBTASK = gql`
  mutation ToggleSubtask($id: UUID!) {
    toggleSubtask(id: $id) {
      id
      todoId
      completed
    }
  }
`

// ─── Budget mutations ─────────────────────────────────────────────────────────

export const CREATE_BUDGET_ENTRY = gql`
  mutation CreateBudgetEntry($input: CreateBudgetEntryInput!) {
    createBudgetEntry(input: $input) {
      id
      userId
      type
      category
      amount
      description
      date
      createdAt
    }
  }
`

export const DELETE_BUDGET_ENTRY = gql`
  mutation DeleteBudgetEntry($id: UUID!) {
    deleteBudgetEntry(id: $id)
  }
`
