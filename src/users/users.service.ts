import { Injectable } from '@nestjs/common';
import { IUserService, SearchUserParams } from './users.interface';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from '../utils/types';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}
  async create({ passwordHash, ...data }: Partial<User>): Promise<User> {
    const salt = genSaltSync(10);
    console.log(passwordHash, salt);
    const user = new this.UserModel({
      passwordHash: hashSync(passwordHash, salt),
      ...data,
    });
    try {
      const res = await user.save();
      return res;
    } catch (e) {
      return e.message;
    }
  }

  async findAll({
    limit,
    offset,
    ...filters
  }: SearchUserParams): Promise<User[]> {
    return this.UserModel.find(filters)
      .limit(limit)
      .skip(offset)
      .select('-__v')
      .exec();
  }

  async findByEmail(email: SearchUserParams['email']): Promise<User> {
    return this.UserModel.findOne({ email }).select('-__v').exec();
  }

  async findById(id: ID): Promise<User> {
    return this.UserModel.findById(id).select('-__v');
  }
}
