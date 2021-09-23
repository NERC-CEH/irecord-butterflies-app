/** ****************************************************************************
 * User model describing the user model on backend. Persistent.
 **************************************************************************** */
import CONFIG from 'common/config';
import * as Yup from 'yup';
import { Model } from '@apps';
import axios from 'axios';
import { observable } from 'mobx';
import { genericStore } from './store';
import serviceExtension from './userStatsExt';

class UserModel extends Model {
  loginSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  loginSchemaBackend = Yup.object().shape({
    id: Yup.number().required(),
    warehouse_id: Yup.number().required(),
    email: Yup.string().email().required(),
    firstname: Yup.string().required(),
    secondname: Yup.string().required(),
    name: Yup.string().required(),
  });

  resetSchema = Yup.object().shape({
    email: Yup.string().required(),
  });

  resetSchemaBackend = Yup.object().shape({
    data: Yup.object().shape({
      id: Yup.number().required(),
      firstname: Yup.string().required(),
      secondname: Yup.string().required(),
      type: Yup.string().required(),
    }),
  });

  registerSchema = Yup.object().shape({
    email: Yup.string().email('email is not valid').required(),
    firstName: Yup.string().required(),
    secondName: Yup.string().required(),
    password: Yup.string().required(),
  });

  registerSchemaBackend = Yup.object().shape({
    id: Yup.number().required(),
    warehouse_id: Yup.number().required(),
    email: Yup.string().email().required(),
    firstname: Yup.string().required(),
    secondname: Yup.string().required(),
    name: Yup.string().required(),
  });

  uploadCounter = observable({ count: 0 })

  constructor(...args) {
    super(...args);
    Object.assign(this, serviceExtension);
  }

  async logOut() {
    return this.resetDefaults();
  }

  async logIn(email, password) {
    console.log('User: logging in.');

    const userAuth = btoa(`${email}:${password}`);
    const url = `${CONFIG.backend.url}/api/v1/users/${encodeURIComponent(
      email
    )}`;
    const options = {
      headers: {
        authorization: `Basic ${userAuth}`,
        'x-api-key': CONFIG.backend.apiKey,
        'content-type': 'application/json',
      },
      timeout: 80000,
    };

    let res;
    try {
      res = await axios(url, options);
      res = res.data;
      const isValidResponse = await this.loginSchemaBackend.isValid(res.data);
      if (!isValidResponse) {
        throw new Error('Invalid backend response.');
      }
    } catch (e) {
      res = e.response || {};
      let message = res.statusText;
      if (res.data && res.data.errors) {
        const err = res.data.errors[0] || {};
        message = err.title;
      }
      throw new Error(message || 'The request was not successful.');
    }

    const user = { ...res.data, ...{ password } };
    this._logIn(user);
  }

  async register(email, password, firstName, secondName) {
    console.log('User: registering.');

    const userAuth = btoa(`${email}:${password}`);
    const options = {
      headers: {
        authorization: `Basic ${userAuth}`,
        'x-api-key': CONFIG.backend.apiKey,
        'content-type': 'plain/text',
      },
      timeout: 80000,
    };

    const data = JSON.stringify({
      data: {
        type: 'users',
        email,
        password,
        secondname: secondName,
        firstname: firstName,
      },
    });

    let res;
    try {
      res = await axios.post(
        `${CONFIG.backend.url}/api/v1/users/`,
        data,
        options
      );
      res = res.data;
      const isValidResponse = await this.registerSchemaBackend.isValid(
        res.data
      );
      if (!isValidResponse) {
        throw new Error('Invalid backend response.');
      }
    } catch (e) {
      res = e.response || {};
      let message = res.statusText;
      if (res.data && res.data.errors) {
        const err = res.data.errors[0] || {};
        message = err.title;

        if (message === 'Account already exists.') {
          message =
            'There is already an account with this email address, please login.';
        }
      }

      throw new Error(message || 'The request was not successful.');
    }

    const user = { ...res.data, ...{ password } };
    this._logIn(user);
  }

  async reset(email) {
    console.log('User: resetting.');

    const options = {
      headers: {
        'x-api-key': CONFIG.backend.apiKey,
        'content-type': 'plain/text',
      },
      timeout: 80000,
    };

    const data = JSON.stringify({
      data: {
        type: 'users',
        password: ' ', // reset password
      },
    });

    let res;
    try {
      const url = `${CONFIG.backend.url}/api/v1/users/${encodeURIComponent(
        email
      )}`;
      res = await axios.put(url, data, options);
      res = res.data;
      const isValidResponse = await this.resetSchemaBackend.isValid(res);
      if (!isValidResponse) {
        throw new Error('Invalid backend response.');
      }
    } catch (e) {
      res = e.response || {};
      throw new Error(res.statusText || 'The request was not successful.');
    }
  }

  _logIn(user) {
    console.log('UserModel: logging in.');

    this.attrs.id = user.id;
    this.attrs.indiciaUserId = user.warehouse_id;
    this.attrs.password = user.password || '';
    this.attrs.email = user.email || '';
    this.attrs.name = user.name || '';
    this.attrs.firstName = user.firstname || ''; // note: no camel
    this.attrs.secondName = user.secondname || ''; // note: no camel

    return this.save();
  }

  hasLogIn() {
    return !!this.attrs.email;
  }

  getUser() {
    return this.attrs.email;
  }

  getPassword() {
    return this.attrs.password;
  }
}

const defaults = {
  firstName: '',
  secondName: '',
  email: null,
  password: null,
  name: null,
  id: null,

  lastThankYouMilestoneShown: 0,

  stats: null,
  statsYears: {},
};

const userModel = new UserModel(genericStore, 'user', defaults);
export { userModel as default, UserModel };
