import { observer } from 'mobx-react';
import { star } from 'ionicons/icons';
import { IonBackdrop, IonItem, IonIcon, IonLabel } from '@ionic/react';
import userModel from 'models/user';
import './styles.scss';

const ThankYouAlert = () => {
  if (!userModel.isLoggedIn()) return null;

  const milestone = userModel.getAchievedStatsMilestone();
  if (!milestone) return null;

  let stars = [];
  if (milestone >= 25) stars = Array.from(Array(1));
  if (milestone >= 50) stars = Array.from(Array(2));
  if (milestone >= 100) stars = Array.from(Array(3));
  if (milestone >= 500) stars = Array.from(Array(4));
  if (milestone >= 1000) stars = Array.from(Array(5));

  const getStarIcon = (_: any, index: number) => (
    <IonIcon key={index} icon={star} />
  );
  const starIcons = stars.map(getStarIcon);

  const currentYear = new Date().getFullYear();

  const closeAlert = () => {
    userModel.data.lastThankYouMilestoneShown[currentYear] = milestone; // eslint-disable-line
  };

  return (
    <div className="custom-alert">
      <IonBackdrop tappable visible stopPropagation />
      <div className="message">
        <div className="stars-icon-wrapper">{starIcons}</div>
        <h2 className="title">Thanks!</h2>
        <p className="message-total-records">
          Over <b>{milestone}</b> records submitted
        </p>
        <p className="message-content-with-background">
          You have now uploaded over <b>{milestone}</b> butterfly records
          through this app since the start of <b>{currentYear}</b>, many thanks!
        </p>

        <p>Every record you submit helps us to conserve the UK's butterflies</p>

        <IonItem onClick={closeAlert} lines="none">
          <IonLabel>OK</IonLabel>
        </IonItem>
      </div>
    </div>
  );
};

export default observer(ThankYouAlert);
