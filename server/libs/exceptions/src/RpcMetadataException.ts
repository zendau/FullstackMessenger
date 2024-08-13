import { RpcException } from '@nestjs/microservices';

export class DetailedRpcException extends RpcException {
  constructor(message: string | object, private readonly code: number) {

    if (typeof message === 'object') {
      message = JSON.stringify(message)
    }

    console.log('ttt', message, code)
    super({ code, message });
  }

  getCustomCode(): number {
    return this.code;
  }

  getError() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
