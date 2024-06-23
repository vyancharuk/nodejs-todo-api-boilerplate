import type { Knex } from "knex";
import { Application, Request, Response, NextFunction } from 'express';
import { Container, injectable, inject, interfaces } from 'inversify';
import toCamelCase from 'camelcase-keys';
import Joi from '@hapi/joi';
import Operation from './operation';
import { User } from '../modules/users/types';
import * as HTTP_STATUS from 'http-status';

enum UserRoles {
  Anonym = 1,
  Registered = 2,
  Admin = 4,
}

interface IdNameDTO {
  id: string;
  name: string;
}

type OperationResult = {
  result: string;
  error?: string;
};

interface NotifData {}
type MiddlewareFn = (req: Request, res: Response, next: NextFunction) => any;

class CustomError extends Error {
  public status: number;

  constructor(status, name, message) {
    super();
    this.name = name;
    this.message = message;
    this.status = status;
  }
}

export {
  injectable,
  inject,
  Application,
  Request,
  Response,
  NextFunction,
  Joi,
  Knex,
  Container,
  interfaces,
  User,
  IdNameDTO,
  MiddlewareFn,
  NotifData,
  Operation,
  toCamelCase,
  CustomError,
  UserRoles,
  OperationResult,
  HTTP_STATUS,
};
