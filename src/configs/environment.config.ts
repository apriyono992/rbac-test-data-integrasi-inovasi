import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const EnvironmentConfig = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: [`.env`],
  validationSchema: Joi.object({
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    SYNC_DEFAULT: Joi.boolean().required()
  }),
});
