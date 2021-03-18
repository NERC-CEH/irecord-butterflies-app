import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IonFab,
  IonFabList,
  IonIcon,
  IonFabButton,
  createGesture,
  IonLabel,
} from '@ionic/react';
import './styles.scss';

class LongPressFabButton extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.any,
    icon: PropTypes.any.isRequired,
    label: PropTypes.any,
  };

  buttonRef = React.createRef();

  fabRef = React.createRef();

  componentDidMount() {
    const { onClick } = this.props;

    this.gesture = createGesture({
      el: this.buttonRef.current,
      threshold: 0,
      passive: false,
      gestureName: 'long-press',
      onStart: ev => {
        ev.event.preventDefault();
        ev.event.stopPropagation();
        ev.event.stopImmediatePropagation();
        const isShowingList = this.fabRef.current.activated;

        if (isShowingList) {
          this.fabRef.current.close();
        } else {
          this.longPressActive = true;
          this.longPressAction();
        }
      },
      onEnd: ev => {
        ev.event.preventDefault();
        ev.event.stopPropagation();
        ev.event.stopImmediatePropagation();

        if (this.longPressActive) {
          this.longPressActive = false;
          onClick();
          return;
        }

        this.longPressActive = false;
      },
    });
    this.gesture.enable(true);
  }

  longPressAction() {
    if (this.action) {
      clearInterval(this.action);
    }

    const clickFabIfActive = () => {
      if (this.longPressActive === true) {
        this.longPressActive = false;
        this.fabRef.current.click();
      }
    };

    this.action = setTimeout(clickFabIfActive, 400);
  }

  componentWillUnmount() {
    this.gesture.enable(false);
  }

  render() {
    const { children, icon, label } = this.props;

    return (
      <IonFab ref={this.fabRef} vertical="bottom" horizontal="center">
        <IonFabList side="top">
          <div className="fab-backdrop" />
        </IonFabList>

        <IonFabButton ref={this.buttonRef}>
          <div className="container">
            <IonIcon icon={icon} />
            <IonLabel icon={icon}>{label}</IonLabel>
          </div>
        </IonFabButton>

        {children}
      </IonFab>
    );
  }
}

export default LongPressFabButton;
