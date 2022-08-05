import { FC } from 'react';
// import Media from 'models/image';
import { IonLabel, IonIcon, IonBadge } from '@ionic/react';
import { camera } from 'ionicons/icons';
import CONFIG from 'common/config';
import './styles.scss';

interface Props {
  className?: string;
  species?: any;
}

const ProbabilityBadge: FC<Props> = ({ className, species }) => {
  if (!species) return null;

  const { probability } = species;

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
    <IonBadge className={`badge-${color} ${className}`}>
      <IonIcon icon={camera} className="icon" />
      <IonLabel className="text">{roundedProbability}%</IonLabel>
    </IonBadge>
  );
};

export default ProbabilityBadge;
