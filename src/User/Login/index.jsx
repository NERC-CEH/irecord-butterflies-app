import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { toast, Page, Header } from '@apps';
import * as Sentry from '@sentry/browser';
import Main from './Main';
import './styles.scss';

const { success } = toast;

async function onLogin(_, details) {
  const { email, password } = details;

  console.log(`a login issue "${email}" "${password}"`);
  console.log(details);

  // console.error(`LOGIN ISSUE "${email}" "${password}"`);
  Sentry.captureException(`LOGIN ISSUE... "${email}" "${password}"`);

  success('Thanks!!');
}

function LoginContainer({ userModel, onSuccess }) {
  const context = useContext(NavContext);

  const onSuccessReturn = () => {
    onSuccess && onSuccess();

    const { email } = userModel.attrs;
    success(`Successfully logged in as: ${email}`);
    context.navigate('/home/surveys', 'root');
  };

  const onLoginWrap = details => onLogin(userModel, details, onSuccessReturn);

  return (
    <Page id="user-login">
      <Header className="ion-no-border" routerDirection="none" />
      <Main schema={userModel.loginSchema} onSubmit={onLoginWrap} />
    </Page>
  );
}

LoginContainer.propTypes = exact({
  userModel: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
});

export default LoginContainer;
