import { Component } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Trans as T } from 'react-i18next';
import { IonItem, IonIcon, IonLabel } from '@ionic/react';
import { remove, add } from 'ionicons/icons';
import clsx from 'clsx';
import './styles.scss';

class Collapse extends Component {
  state = { open: false };

  // eslint-disable-next-line @getify/proper-arrows/name
  onClick = () => {
    // eslint-disable-next-line
    this.setState(prevState => ({ open: !prevState.open }));
  };

  render() {
    const { title, children, className, open } = this.props;

    return (
      <>
        <IonItem
          onClick={this.onClick}
          className={clsx(
            'collapse-block',
            'in-list',
            (this.state.open || open) && 'opened',
            className
          )}
        >
          <IonLabel class="ion-text-wrap">
            <T>{title}</T>
          </IonLabel>
          <IonIcon icon={this.state.open || open ? remove : add} slot="end" />
        </IonItem>

        {(this.state.open || open) && children}
      </>
    );
  }
}

Collapse.propTypes = exact({
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
});

export default Collapse;
