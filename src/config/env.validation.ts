import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  MONGODB_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  FRONTEND_URL: Joi.string().required(),
  ADMIN_URL: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().empty('').optional(),
  CLOUDINARY_API_KEY: Joi.string().when('CLOUDINARY_CLOUD_NAME', {
    is: Joi.string().min(1),
    then: Joi.required(),
    otherwise: Joi.optional().empty(''),
  }),
  CLOUDINARY_API_SECRET: Joi.string().when('CLOUDINARY_CLOUD_NAME', {
    is: Joi.string().min(1),
    then: Joi.required(),
    otherwise: Joi.optional().empty(''),
  }),
  CLOUDINARY_FOLDER: Joi.string().optional().allow(''),
  SMTP_HOST: Joi.string().empty('').optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().when('SMTP_HOST', {
    is: Joi.string().min(1),
    then: Joi.required(),
    otherwise: Joi.optional().empty(''),
  }),
  SMTP_PASS: Joi.string().when('SMTP_HOST', {
    is: Joi.string().min(1),
    then: Joi.required(),
    otherwise: Joi.optional().empty(''),
  }),
  SMTP_FROM: Joi.alternatives()
    .try(Joi.string().email(), Joi.string().pattern(/.+<[^>]+@[^>]+>/))
    .optional()
    .allow(''),
  SMTP_SECURE: Joi.boolean().optional(),
  SMTP_NOTIFY_TO: Joi.string().email().optional().allow(''),
});
