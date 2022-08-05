import { FC } from 'react';
import { IonLabel, IonIcon, IonBadge } from '@ionic/react';
import { camera } from 'ionicons/icons';
import CONFIG from 'common/config';
import './styles.scss';

interface Props {
  probability?: number;
}

const ProbabilityBadge: FC<Props> = ({ probability }) => {
  if (!probability) return null;

  const roundedProbability = (probability * 100).toFixed();

  let color;
  if (probability > CONFIG.POSITIVE_THRESHOLD) {
    color = 'success';
  } else if (probability > CONFIG.POSSIBLE_THRESHOLD) {
    color = 'possible';
  } else {
    color = 'notLikely';
  }

  return (
    <IonBadge className={`badge badge-${color}`}>
      <IonIcon icon={camera} className="icon" />
      <IonLabel className="text">{roundedProbability}%</IonLabel>
    </IonBadge>
  );
};

export default ProbabilityBadge;
