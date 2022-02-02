/** ****************************************************************************
 * User model describing the user model on backend. Persistent.
 **************************************************************************** */
import CONFIG from 'common/config';
import * as Yup from 'yup';
import { DrupalUserModel, toast, loader } from '@apps';
import { observable } from 'mobx';
import { genericStore } from './store';
import serviceExtension from './userStatsExt';

const { warn, error, success } = toast;

class UserModel extends DrupalUserModel {
  registerSchema = Yup.object().shape({
    email: Yup.string().email('email is not valid').required('Please fill in'),
    password: Yup.string().required('Please fill in'),
    firstName: Yup.string().required('Please fill in'),
    secondName: Yup.string().required('Please fill in'),
  });

  uploadCounter = observable({ count: 0 });

  constructor(...args) {
    super(...args);
    Object.assign(this, serviceExtension);

    const checkForValidation = () => {
      if (this.hasLogIn() && !this.attrs.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };
    this._init.then(checkForValidation);
  }

  hasLogIn() {
    return !!this.attrs.email;
  }

  async checkActivation() {
    const isLoggedIn = !!this.attrs.id;
    if (!isLoggedIn) {
      warn('Please log in first.');
      return false;
    }

    if (!this.attrs.verified) {
      await loader.show({
        message: 'Please wait...',
      });

      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      loader.hide();

      if (!this.attrs.verified) {
        warn('The user has not been activated or is blocked.');
        return false;
      }
    }

    return true;
  }

  async resendVerificationEmail() {
    const isLoggedIn = !!this.attrs.id;
    if (!isLoggedIn) {
      warn('Please log in first.');
      return false;
    }

    if (this.attrs.verified) {
      warn('You are already verified.');
      return false;
    }

    await loader.show({
      message: 'Please wait...',
    });

    try {
      await super.resendVerificationEmail();
      success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.',
        5000
      );
    } catch (e) {
      error(e);
    }

    loader.hide();

    return true;
  }

  getPrettyName = () => {
    if (!this.hasLogIn()) return '';

    return `${this.attrs.firstName} ${this.attrs.lastName}`;
  };

  async getAccessToken(...args) {
    if (this.attrs.password) await this._migrateAuth();

    return super.getAccessToken(...args);
  }

  /**
   * Migrate from Indicia API auth to JWT. Remove in the future versions.
   */
  async _migrateAuth() {
    console.log('Migrating user auth.');

    const tokens = await this._exchangePasswordToTokens(
      this.attrs.email,
      this.attrs.password
    );
    this.attrs.tokens = tokens;
    delete this.attrs.password;

    await this._refreshAccessToken();
    return this.save();
  }
}

const defaults = {
  firstName: '',
  secondName: '',
  email: null,

  lastThankYouMilestoneShown: {},

  stats: null,
  statsYears: {},
};

const userModel = new UserModel(genericStore, 'user', defaults, CONFIG.backend);
export { userModel as default, UserModel };
