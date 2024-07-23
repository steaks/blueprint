export interface User {
  readonly id: string;
  readonly name: string;
  readonly teamId?: string;
  readonly teamName?: string;
}

export interface Team {
  readonly id: string;
  readonly name: string;
}

export interface Task {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly ownerId?: string;
  readonly ownerName?: string;
  readonly teamName?: string
}