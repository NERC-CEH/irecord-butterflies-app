import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { NavContext } from '@ionic/react';
import { toast, Page, Header, loader } from '@apps';
import * as Sentry from '@sentry/browser';
import Main from './Main';
import './styles.scss';

const { success, error } = toast;

async function onLogin(userModel, details, onSuccess) {
  const { email, password } = details;
  try {
    console.log(`a login issue 2 "${email}" "${password}"`);
    console.log(JSON.stringify(details));

    Sentry.captureException(
      `LOGIN ISSUE 2... "${email}" (${email.trim()}) "${password}"`
    );
  } catch (_) {
    //
  }

  await loader.show({
    message: 'Please wait...',
  });

  try {
    await userModel.logIn(email.trim(), password);

    onSuccess();
  } catch (err) {
    Sentry.captureException(err);
    error(err.message);
  }

  loader.hide();
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
    <Page id="user-login2">
      <Header className="ion-no-border" routerDirection="none" />
      <Main onSubmit={onLoginWrap} />
    </Page>
  );
}

LoginContainer.propTypes = exact({
  userModel: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
});

export default LoginContainer;