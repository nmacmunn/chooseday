export const assign = jest.fn(() => ({}));
export const createMachine = jest.fn(() => ({}));
export const interpret = jest.fn(() => ({
  start() {
    return {
      state: {},
    };
  },
}));
