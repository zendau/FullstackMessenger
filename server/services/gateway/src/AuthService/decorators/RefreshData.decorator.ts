import { createParamDecorator } from '@nestjs/common';

const RefreshData = createParamDecorator((data, req) => {
  const reqData = req.args[0];
  const refreshToken = reqData.cookies[data];
  const ip =
    reqData.headers['x-forwarded-for'] || reqData.socket.remoteAddress || null;
  const mobileData = reqData.headers['mobile'];
  const userAgent = reqData.headers['user-agent'];
  const resData = {
    refreshToken,
    device: {
      ip,
      system: {
        mobileData,
        userAgent,
      },
    }
  }

  return resData;
});

export default RefreshData;
