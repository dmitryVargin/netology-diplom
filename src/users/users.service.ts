import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserService, SearchUserParams } from './users.interface';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async create({ passwordHash, ...data }: Partial<User>): Promise<User> {
    const salt = genSaltSync(10);
    const user = new this.UserModel({
      passwordHash: hashSync(passwordHash as string, salt),
      ...data,
    });

    const res = await user.save();
    if (res) {
      throw new NotFoundException();
    }
    return res;
  }

  async findAll({
    limit,
    offset,
    ...filters
  }: SearchUserParams): Promise<User[]> {
    return this.UserModel.find(filters).limit(limit).skip(offset).exec();
  }

  async findByEmail(email: SearchUserParams['email']): Promise<User> {
    const user = await this.UserModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}
