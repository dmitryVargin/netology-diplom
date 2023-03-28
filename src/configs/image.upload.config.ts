import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { DiskStorageOptions } from 'multer';

export const imageFileFilter: MulterOptions['fileFilter'] = (
  req,
  file,
  callback,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName: DiskStorageOptions['filename'] = (
  req,
  file,
  callback,
) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};
