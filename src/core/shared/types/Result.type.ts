type Success<T> = {
  success: true;
  data: T;
};

type Failure = {
  success: false;
  error: string;
  code?: number;
};

export type Result<T> = Success<T> | Failure;
