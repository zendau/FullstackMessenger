import { CacheInterceptor, ExecutionContext, Injectable } from "@nestjs/common";

import { cacheKeys } from "./cacheKeys";

@Injectable()
export default class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;

    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = [
      // Routes to be excluded
    ];
    if (
      !isGetRequest ||
      (isGetRequest &&
        excludePaths.includes(httpAdapter.getRequestUrl(request)))
    ) {
      return undefined;
    }

    let cachePath = null

    switch (request.route.path) {
      case '/user/getById/:id':
        cachePath = cacheKeys.GET_USER_DATA
        break;
      default:
        cachePath = 'free'
        break;
    }

    const id = request.params.id;
    return `${cachePath}/${id}`;
    
  }
}
