import { Exception } from '../../../exceptions';

export type ExceptionAction = (exception: Exception) => Exception;
