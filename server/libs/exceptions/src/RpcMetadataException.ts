import { RpcException } from '@nestjs/microservices';

export class DetailedRpcException extends RpcException {
  constructor(message: string, private readonly code: number) {
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
