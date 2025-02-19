import { Request, Response } from "express";

export type RequestType<
  Params,
  Body,
  CookiePayload = {},
  ParsedQs = {}
> = Request<
  // req.params
  Params,
  // Used for req.res
  any,
  // req.body
  Body & CookiePayload,
  // req.query
  ParsedQs,
  // used for req.res
  Record<string, any>
>;

export type ResponseType = Response<any, Record<string, any>>;

/**
 * Defines possible response status names for API requests.
 * - `success`: Indicates successful operations with a status code of 200 or 201. It typically signifies successful validation in the database.
 * - `failure`: Indicates failed operations with a status code of 200 or 201. It typically signifies failed validation in the database.
 * - `not-found`: Indicates that the requested resource was not found, with a status code of 200 or 201. It typically signifies failed validation in the database.
 * - `already-exists`: Indicates that the requested resource already exists, with a status code of 200 or 201. It typically signifies failed validation in the database.
 * - `validation-error`: Indicates a payload validation error with a status code of 400.
 * - `value-not-allowed`: Indicates that a provided value is not allowed, with a status code of 400.
 * - `permission-denied`: Indicates permission denial with a status code of 401.
 * - `forbidden`: Indicates forbidden access with a status code of 403.
 */
export type ResponseStatusNames =
  | "success"
  | "failure"
  | "not-found"
  | "already-exists"
  | "validation-error"
  | "value-not-allowed"
  | "permission-denied"
  | "forbidden";

export interface ResponseDataType<DataType = undefined> {
  err: boolean;
  statusName: ResponseStatusNames;
  msg: string;
  data?: DataType;
  errors: Array<string>;
}
