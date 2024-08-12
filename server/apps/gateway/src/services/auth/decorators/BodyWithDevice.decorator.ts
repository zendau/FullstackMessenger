import { createParamDecorator } from '@nestjs/common';

const BodyWithDevice = createParamDecorator((_, req) => {
  const reqData = req.args[0];
  const userData = reqData.body;
  const ip =
    reqData.headers['x-forwarded-for'] || reqData.socket.remoteAddress || null;
  const mobileData = reqData.headers['mobile'];
  const userAgent = reqData.headers['user-agent'];
  userData.system = {
    ip,
    system: {
      mobileData,
      userAgent,
    },
  };

  return userData;
});

export default BodyWithDevice;
