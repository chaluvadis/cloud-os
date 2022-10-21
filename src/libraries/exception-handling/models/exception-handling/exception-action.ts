import { Exception } from '../../../exceptions/exception';

export type ExceptionAction = (exception: Exception) => Exception;
