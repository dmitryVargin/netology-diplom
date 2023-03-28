import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemeBaseOptions } from '../../utils/constants';

export type UserDocument = User & Document;

@Schema({ ...SchemeBaseOptions })
export class User {
  @Prop({
    validate: {
      validator: async function (email: string): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const user = await this.constructor.findOne({ email });
        if (user) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return this.id === user.id;
        }
        return true;
      },

      message: () => 'Указанный email адрес уже используется.',
    },
    required: [true, 'Поле "email" обязательно к заполнению'],
  })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  name: string;
  @Prop()
  contactPhone: string;
  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
