import { ObjectType } from './object-type';

export interface IResult {
  code: number;
  data?: ObjectType;
  msg: string;
}
