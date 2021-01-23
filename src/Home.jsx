import React from 'react';
// import PropTypes from 'prop-types';
import { IonMenuButton, IonToolbar, IonHeader, NavContext } from '@ionic/react';
import { Page, Main } from '@apps';

class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = {};

  render() {
    return (
      <Page id="home">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonMenuButton slot="start" />
          </IonToolbar>
        </IonHeader>

        <Main>Home page Main</Main>
      </Page>
    );
  }
}

export default Component;
