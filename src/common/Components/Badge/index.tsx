import { FC } from 'react';
import Media from 'models/image';
import { IonLabel, IonIcon, IonBadge } from '@ionic/react';
import { camera } from 'ionicons/icons';
import './styles.scss';

interface Props {
  media: Media;
  className?: string;
}

const POSITIVE_THRESHOLD = 0.7;
const POSSIBLE_THRESHOLD = 0.2;

const ClassifierScore: FC<Props> = ({ media, className }) => {
  const hasBeenIdentified = media?.attrs?.species?.length;
  if (!hasBeenIdentified) return null;

  const { probability } = media.getTopSpecies();

  const roundedProbability = (probability * 100).toFixed();

  let color;
  if (probability > POSITIVE_THRESHOLD) {
    color = 'success';
  } else if (probability > POSSIBLE_THRESHOLD) {
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

export default ClassifierScore;
