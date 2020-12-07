import express from 'express';

type BeforeMiddleware = express.RequestHandler;
type InitBeforeMiddleware = (object) => BeforeMiddleware;

export {
  BeforeMiddleware,
  InitBeforeMiddleware,
}
