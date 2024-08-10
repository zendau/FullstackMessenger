import { CacheInterceptor, ExecutionContext, Injectable } from "@nestjs/common";

import { cacheKeys } from "./cacheKeys";

@Injectable()
export default class HttpClearCacheInterceptor extends CacheInterceptor {

  isRequestCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let cachePath = null
    const id = request.body.userId;

    switch (request.route.path) {
      case '/user/blockUser':
        cachePath = cacheKeys.GET_USER_DATA
        break;
      case '/user/unBlockUser':
        cachePath = cacheKeys.GET_USER_DATA
        break;
      case '/user/editData':
        cachePath = cacheKeys.GET_USER_DATA
        break;
      default:
        cachePath = `${cachePath}/${id}`;
        break;
    }

    this.cacheManager.del(`${cachePath}/${id}`);
    return false;
  }
}
