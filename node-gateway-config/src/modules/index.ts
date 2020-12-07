import { 
  BeforeMiddleware,
  InitBeforeMiddleware,
} from '@utils/types/middleware';

const initBeforeMiddlewareList: Array<InitBeforeMiddleware> = [
];

export default function initMiddlewareList(configData: object): Array<BeforeMiddleware> {
  return initBeforeMiddlewareList.map((initBeforeMiddleware: InitBeforeMiddleware): BeforeMiddleware => {
    return initBeforeMiddleware(configData);
  })
};
