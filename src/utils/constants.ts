import { SchemaOptions } from '@nestjs/mongoose';

export const jwtConstants = {
  secret: 'secretKey',
};
export const LIMIT_DEFAULT = 100;
export const OFFSET_DEFAULT = 0;

export const SchemeBaseOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  },
};
