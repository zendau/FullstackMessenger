import { extname } from 'path';
import * as uuid from 'uuid';

export default (req, file, cb) => {
  cb(null, `${uuid.v4()}${extname(file.originalname)}`);
};
