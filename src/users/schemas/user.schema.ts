import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    validate: {
      validator: async function (email) {
        const validateEmail = function (email) {
          const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email);
        };

        const user = await this.constructor.findOne({ email });
        if (user) {
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
