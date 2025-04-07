declare module 'zustand' {
  export type StateCreator<T> = (set: (partial: Partial<T> | ((state: T) => Partial<T>)) => void, get: () => T) => T;
  
  export function create<T>(createState: StateCreator<T>): {
    (): T;
    <U>(selector: (state: T) => U): U;
  };
}