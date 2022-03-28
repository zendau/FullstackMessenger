import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';

export default (req, file, cb) => {
  const storagePath = process.env.STORE_PATH;
  let path = req.body.path;

  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
  const filePath = storagePath + path;

  if (fs.existsSync(filePath)) {
    cb(null, filePath);
  } else {
    cb(new HttpException('wrong path', HttpStatus.BAD_REQUEST), null);
  }
};
