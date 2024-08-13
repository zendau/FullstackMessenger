import { RpcException } from '@nestjs/microservices';

export class DetailedRpcException extends RpcException {
  private isParse: boolean;

  constructor(message: string | object, private readonly code: number) {
    const isObjectMessage = typeof message === 'object';

    if (isObjectMessage) {
      message = JSON.stringify(message);
    }

    super({ code, message });

    if (isObjectMessage) {
      this.isParse = true;
    } else {
      this.isParse = false;
    }
  }

  getCustomCode(): number {
    return this.code;
  }

  getError() {
    return {
      isParse: this.isParse,
      code: this.code,
      message: this.message,
    };
  }
}
