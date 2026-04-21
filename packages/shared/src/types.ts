export enum Workspace {
  PARK = 'park',
  EXPERT = 'expert',
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
