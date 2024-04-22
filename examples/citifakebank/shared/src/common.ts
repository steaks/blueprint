export interface Deposit {
  readonly amount: number;
  readonly username: string;
}

export interface Withdraw {
  readonly amount: number;
  readonly username: string;
}

export interface Fee {
  readonly amount: number;
  readonly username: string;
}

export interface User {
  readonly id: string;
  readonly name: string;
}