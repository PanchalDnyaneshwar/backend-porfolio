import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

export const multerFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException(
        'Unsupported file type. Upload an image, PDF, document, spreadsheet, presentation, text file, or ZIP archive.',
      ) as unknown as Error,
      false,
    );
  }

  callback(null, true);
};

export const multerLimits = {
  fileSize: 10 * 1024 * 1024,
};
