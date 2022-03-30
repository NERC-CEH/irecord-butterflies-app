import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonButton, IonList } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Main } from '@apps';

class Component extends React.Component {
  emailRef = React.createRef();

  passRef = React.createRef();

  togglePassword = () => {
    const invertShowPassword = prevState => ({
      showPassword: !prevState.showPassword,
    });
    this.setState(invertShowPassword);
  };

  onSubmitWrap = () => {
    console.log('submitting 2');
    const password = this.passRef.current.value;
    const email = this.emailRef.current.value;

    this.props.onSubmit({ email, password });
  };

  render() {
    return (
      <Main>
        <h1>
          <T>Welcome back</T>
        </h1>
        <h2>
          <T>Sign in to your account to start</T>
        </h2>

        <IonList lines="full">
          <input placeholder="email" type="text" ref={this.emailRef} />
          <input placeholder="pass" type="password" ref={this.passRef} />

          <IonButton
            color="primary"
            type="submit"
            expand="block"
            onClick={this.onSubmitWrap}
          >
            <T>Sign In</T>
          </IonButton>
        </IonList>
      </Main>
    );
  }
}

Component.propTypes = exact({
  onSubmit: PropTypes.func.isRequired,
});

export default Component;
