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
    contactId
    contactName
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
      contactId
      contactName
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

// ─── User mutations ──────────────────────────────────────────────────────────

export const SYNC_USER = gql`
  mutation SyncUser($input: SyncUserInput!) {
    syncUser(input: $input)
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

// ─── Streak entry queries ────────────────────────────────────────────────────

export const GET_STREAK_ENTRIES = gql`
  query GetStreakEntries($userId: UUID!) {
    streakEntries(userId: $userId) {
      id
      userId
      title
      rules
      currentStreak
      longestStreak
      startDate
      lastCheckIn
      isActive
      createdAt
    }
  }
`

// ─── Streak entry mutations ──────────────────────────────────────────────────

export const CREATE_STREAK_ENTRY = gql`
  mutation CreateStreakEntry($input: CreateStreakEntryInput!) {
    createStreakEntry(input: $input) {
      id
      title
      rules
      currentStreak
      longestStreak
      startDate
      lastCheckIn
      isActive
      createdAt
    }
  }
`

export const CHECK_IN_STREAK_ENTRY = gql`
  mutation CheckInStreakEntry($input: CheckInStreakEntryInput!) {
    checkInStreakEntry(input: $input) {
      id
      currentStreak
      longestStreak
      lastCheckIn
      isActive
    }
  }
`

export const BREAK_STREAK_ENTRY = gql`
  mutation BreakStreakEntry($id: UUID!) {
    breakStreakEntry(id: $id) {
      id
      currentStreak
      isActive
    }
  }
`

export const DELETE_STREAK_ENTRY = gql`
  mutation DeleteStreakEntry($id: UUID!) {
    deleteStreakEntry(id: $id)
  }
`
