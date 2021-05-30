import * as _ from "lodash";
import { Inject, Singleton } from "typescript-ioc";
import uuid from "uuid/v4";
import { ILoggedInUser } from '../interfaces/IUser';
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
  public async insertLoggedInUser(user: ILoggedInUser) {
    const userExist = await this.findByUserId(user.id);
    if (!_.isEmpty(userExist)) {
      throw {
        code: "UPDATE_CONFLICT",
        status: 409,
        message: `User already exist with id ${user.id}`
      }
    }
    user._id = uuid();
    return this.dbSDK.insertDoc(USER_DB, user, user._id)
      .catch(err => { throw this.dbSDK.handleError(err); });
  }

  public async getLoggedInUser(userId?: string, withToken?: boolean): Promise<ILoggedInUser> {
    if (!userId) {
      const userSession = await this.getUserSession();
      userId = _.get(userSession, 'userId');
    }
    const users = await this.findByUserId(userId);
    let user = users[0];
    if (!withToken) {
      user = _.omit(user, 'accessToken');
    }
    return user;
  }

  public async getAllManagedUsers() {
    const query = {
      selector: { managedBy: { $exists: true } }
    };
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  private async getAllLoggedInUsers() {
    const query = {
      selector: { userId: { $exists: true } }
    };
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  public async updateLoggedInUser(user: ILoggedInUser) {
    if (_.get(user, '_id')) {
      return this.updateDoc(user);
    } else if (_.get(user, 'userId')) {
      const userData = await this.findByUserId(user.userId);
      user._id = _.get(userData[0], '_id');
      return this.updateDoc(user);
    } else {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `_id is mandatory to update user`
      }
    }

  }

  public async deleteLoggedInUser(userId: string) {
    if (!userId) {
      const userSession = await this.getUserSession();
      userId = _.get(userSession, 'userId');
    }
    const users = await this.findByUserId(userId);
    if (users.length > 0) {
      const { _id } = users[0];
      return this.dbSDK.delete(USER_DB, _id);
    } else {
      throw {
        code: "BAD_REQUEST",
        status: 400,
        message: `_id is mandatory to update user`
      }
    }
  }

  public async deleteAllLoggedInUsers() {
    let docs = await this.getAllLoggedInUsers();
    docs = _.map(docs, (doc) => {
      return {
        _id: doc._id,
        _rev: doc._rev,
        _deleted: true
      }
    });

    return this.dbSDK.bulkDocs(USER_DB, docs);
  }

  public async getUserToken() {
    const userSession = await this.getUserSession();
    const userId = _.get(userSession, 'userId');
    const user = await this.getLoggedInUser(userId, true);
    const token = _.get(user, 'accessToken');
    return token;
  }

  public async setUserSession(sessionData = {}) {
    await this.settingSDK.put('userSession', sessionData);
  }

  public async getUserSession() {
    return this.settingSDK.get('userSession');
  }

  public async deleteUserSession() {
    return this.settingSDK.delete('userSession');
  }

  private async findByName(name) {
    const query = {
      selector: { name }
    }
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  private async findByUserId(id: string): Promise<ILoggedInUser[]> {
    const query = {
      selector: { id }
    }
    return this.dbSDK.find(USER_DB, query).then(result => result.docs);
  }

  private async updateDoc(user: ILoggedInUser) {
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
export interface IUserSession {
  userId: string;
}

export * from './../interfaces';
