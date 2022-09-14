import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    console.log(req);

    /**
     * next()를 주석처리하고 res.send()를 하면 다음 미들웨어가 동작하지 않는다.
     * */
    next();
  }
}
