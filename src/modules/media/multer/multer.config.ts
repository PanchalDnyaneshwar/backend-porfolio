import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/svg+xml',
];

export const multerFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Only image files are allowed',
      ) as unknown as Error,
      false,
    );
  }

  callback(null, true);
};

export const multerLimits = {
  fileSize: 5 * 1024 * 1024,
};
