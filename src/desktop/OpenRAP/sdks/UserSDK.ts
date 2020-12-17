import * as _ from "lodash";
import { Inject, Singleton } from "typescript-ioc";
import uuid from "uuid/v4";
import { ISignedInUser } from '../interfaces/IUser';
import { IFramework, IUser } from "./../interfaces";
import { DataBaseSDK } from "./DataBaseSDK";
import SettingSDK from './SettingSDK';
const DEFAULT_USER_NAME = 'guest';
const USER_DB = 'users';

/* @ClassLogger({
  logLevel: "debug",
  logTime: true
})*/
@Singleton
export class UserSDK {

  @Inject private dbSDK: DataBaseSDK;
  @Inject private settingSDK: SettingSDK;
  constructor() { }

  public async read(name = DEFAULT_USER_NAME): Promise<IUser | UserSDKError> {
    const users: Array<IUser> = await this.findByName(name);
    if (!users.length) {
      throw {
        code: "USER_NOT_FOUND",
        status: 404,
        message: `User not found with name ${name}`
      }
    }
    delete users[0]['_rev'];
    return users[0];
  }

  public async create(user: IUser): Promise<{ _id: string } | UserSDKError> {
    if (_.isEmpty(_.get(user, 'framework'))) {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `Framework is mandatory to create user`
      }
    }
    user.formatedName = user.formatedName || DEFAULT_USER_NAME; // user entered name
    user.name = user.formatedName.toLowerCase().trim();
    const userExist = await this.findByName(user.name);
    if (!_.isEmpty(userExist)) {
      throw {
        code: "UPDATE_CONFLICT",
        status: 409,
        message: `User already exist with name ${user.name}`
      }
    }
    user._id = uuid();
    user.createdOn = Date.now();
    user.updatedOn = Date.now();
    return this.dbSDK.insertDoc(USER_DB, user, user._id)
      .then(data => ({ _id: data.id }))
      .catch(err => { throw this.dbSDK.handleError(err); });
  }

  public async update(user: IUserUpdateReq): Promise<{ _id: string } | UserSDKError> {
    if (!_.get(user, '_id')) {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `_id is mandatory to update user`
      }
    }
    user.updatedOn = Date.now();
    return this.dbSDK.updateDoc(USER_DB, user._id, user)
      .then(data => ({ _id: data.id }))
      .catch(err => { throw this.dbSDK.handleError(err); });
  }

  // Logged in users
  public async insertLoggedInUser(user: ISignedInUser) {
    const userExist = await this.findByName(user.userId);
    if (!_.isEmpty(userExist)) {
      throw {
        code: "UPDATE_CONFLICT",
        status: 409,
        message: `User already exist with id ${user.userId}`
      }
    }
    user._id = uuid();
    return this.dbSDK.insertDoc(USER_DB, user, user._id)
      .catch(err => { throw this.dbSDK.handleError(err); });
  }

  public async getLoggedInUser(userId: string) {
    const users = await this.findByUserId(userId);
    return users[0];
  }

  public async updateLoggedInUser(user: ISignedInUser) {
    if (_.get(user, '_id')) {
      return this.updateDoc(user);
    } else if (_.get(user, 'userId')) {
      const userData = await this.findByUserId(user.userId);
      user._id = _.get(userData, '_id');
      return this.updateDoc(user);
    } else {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `_id is mandatory to update user`
      }
    }

  }

  public deleteLoggedInUser(id: string) {
    if (!id) {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `_id is mandatory to update user`
      }
    }
    return this.dbSDK.delete(USER_DB, id);
  }

  public async getUserToken() {
    return await this.settingSDK.get('oauth_token');
  }

  public async setUserToken(sessionData: OAuthSession) {
    await this.settingSDK.put('oauth_token', sessionData);
  }

  private async findByName(name) {
    const query = {
      selector: { name }
    }
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  private async findByUserId(userId: string) {
    const query = {
      selector: { userId }
    }
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  private async updateDoc(user: ISignedInUser) {
    return this.dbSDK.updateDoc(USER_DB, user._id, user)
      .catch(err => { throw this.dbSDK.handleError(err); });
  }

}
export interface UserSDKError {
  code: string;
  status: number;
  message: string;
}
export interface IUserUpdateReq {
  _id: string;
  formatedName?: string;
  framework?: IFramework;
  updatedOn?: number;
}
export interface OAuthSession {
  access_token: string;
  userId: string;
  managed_access_token?: string;
}

export * from './../interfaces';
