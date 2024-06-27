export interface User {
  readonly id: string;
  readonly teamId?: string;
  readonly name: string;
}

export interface Team {
  readonly id: string;
  readonly name: string;
}

export interface Task {
  readonly id: string;
  readonly name: string;
  readonly ownerId?: string;
  readonly status: string;
}