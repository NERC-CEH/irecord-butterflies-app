import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonIcon, IonButton, IonList, IonRouterLink } from '@ionic/react';
import {
  personOutline,
  mailOutline,
  keyOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Formik, Form } from 'formik';
import { Main, InputWithValidation } from '@apps';

import config from 'common/config';

class Component extends React.Component {
  state = {
    showPassword: false,
  };

  togglePassword = () => {
    const invertPasswordShow = prevState => ({
      showPassword: !prevState.showPassword,
    });
    this.setState(invertPasswordShow);
  };

  render() {
    const { showPassword } = this.state;
    const { onSubmit, schema } = this.props;

    const registrationForm = props => (
      <Form>
        <IonList lines="full">
          <InputWithValidation
            name="firstName"
            placeholder="First name"
            icon={personOutline}
            type="text"
            autocomplete="off"
            {...props}
          />
          <InputWithValidation
            name="secondName"
            placeholder="Last name"
            icon={personOutline}
            type="text"
            autocomplete="off"
            {...props}
          />
          <InputWithValidation
            name="email"
            placeholder="Email"
            icon={mailOutline}
            type="email"
            autocomplete="off"
            {...props}
          />
          <InputWithValidation
            name="password"
            placeholder="Password"
            icon={keyOutline}
            type={showPassword ? 'text' : 'password'}
            autocomplete="off"
            {...props}
          >
            <IonButton slot="end" onClick={this.togglePassword} fill="clear">
              <IonIcon
                icon={showPassword ? eyeOutline : eyeOffOutline}
                faint
                size="small"
              />
            </IonButton>
          </InputWithValidation>

          <div className="terms-info-text">
            <T>
              By clicking Sign Up, you agree to our{' '}
              <IonRouterLink href={`${config.backend.url}/privacy-notice`}>
                Privacy Policy
              </IonRouterLink>{' '}
              and{' '}
              <IonRouterLink href={`${config.backend.url}/terms_of_use`}>
                Terms and Conditions
              </IonRouterLink>
            </T>
          </div>
        </IonList>

        <IonButton color="primary" type="submit" expand="block">
          <T>Sign Up</T>
        </IonButton>

        <div className="signin-button">
          <T>I am already a member</T>.{' '}
          <IonRouterLink routerLink="/user/login">
            <T>Sign In</T>
          </IonRouterLink>
        </div>
      </Form>
    );

    return (
      <Main>
        <h1>
          <T>Create a free account</T>
        </h1>

        <Formik
          validationSchema={schema}
          onSubmit={onSubmit}
          initialValues={{}}
        >
          {registrationForm}
        </Formik>
      </Main>
    );
  }
}

Component.propTypes = exact({
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
});

export default Component;
