import { camera } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import CONFIG from 'common/config';
import './styles.scss';

interface Props {
  probability?: number;
}

const ProbabilityBadge = ({ probability }: Props) => {
  if (!probability) return null;

  const roundedProbability = (probability * 100).toFixed();

  let color;
  if (probability > CONFIG.POSITIVE_THRESHOLD) {
    color = 'success';
  } else if (probability > CONFIG.POSSIBLE_THRESHOLD) {
    color = 'plausible';
  } else {
    color = 'unlikely';
  }

  return (
    <div
      className={`badge items-center justify-center bg-white badge-${color}`}
    >
      <IonIcon icon={camera} className="mx-1 size-4 shrink-0" />
      <div className="text-sm">{roundedProbability}%</div>
    </div>
  );
};

export default ProbabilityBadge;
