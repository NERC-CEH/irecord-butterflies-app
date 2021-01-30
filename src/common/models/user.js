/** ****************************************************************************
 * User model describing the user model on backend. Persistent.
 **************************************************************************** */
import CONFIG from 'common/config';
import { DrupalUserModel } from '@apps';
import * as Yup from 'yup';
import { genericStore } from './store';

class UserModel extends DrupalUserModel {
  registerSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
  });
}

const defaults = {
  firstName: '',
  lastName: '',
};

const userModel = new UserModel(genericStore, 'user', defaults, CONFIG.backend);
export { userModel as default, UserModel };
