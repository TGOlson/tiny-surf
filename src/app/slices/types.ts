export type LoadingState<T>
  = {status: 'idle'}
  | {status: 'pending'}
  | {status: 'fulfilled', data: T}
  | {status: 'rejected', error: string};
