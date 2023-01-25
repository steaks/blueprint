export interface Deposit {
  readonly amount: number;
}

export interface Withdraw {
  readonly amount: number;
}

export interface Fee {
  readonly amount: number;
}

const activity = {
  deposits: async (username: string): Promise<Deposit[]> => {
    return Promise.resolve([
      {amount: 100.00},
      {amount: 200.00},
      {amount: 100.00},
      {amount: 200.00},
    ]);
  },
  withdraws: async (username: string): Promise<Withdraw[]> => {
    return Promise.resolve([
      {amount: 25.00},
      {amount: 10.00},
      {amount: 30.00},
    ]);
  },
  fees: async (username: string): Promise<Fee[]> => {
    return Promise.resolve([
      {amount: 0.10},
      {amount: 0.10},
      {amount: 0.10},
    ]);
  }
};

export default activity;
