import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

export default (req, file, cb) => {
  let path = req.body.path;
  debugger;
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
  const filePath = process.env.STORE_PATH + path;

  if (fs.existsSync(filePath)) {
    cb(null, filePath);
  } else {
    cb(new HttpException('wrong path', HttpStatus.BAD_REQUEST), null);
  }
};
