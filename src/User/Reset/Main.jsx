import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { IonButton, IonList } from '@ionic/react';
import { Main, InputWithValidation } from '@apps';
import { personOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Formik, Form } from 'formik';

const Component = ({ onSubmit, schema }) => {
  const resetForm = props => (
    <Form>
      <IonList lines="full">
        <InputWithValidation
          name="email"
          placeholder="Email"
          icon={personOutline}
          type="email"
          autocomplete="off"
          {...props}
        />
      </IonList>

      <IonButton color="primary" type="submit" expand="block">
        <T>Reset</T>
      </IonButton>
    </Form>
  );

  return (
    <Main>
      <h2>
        <T>Enter your email address to request a password reset.</T>
      </h2>

      <Formik validationSchema={schema} onSubmit={onSubmit} initialValues={{}}>
        {resetForm}
      </Formik>
    </Main>
  );
};

Component.propTypes = exact({
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
});

export default Component;
