/* eslint-disable no-param-reassign */
import { FC, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { IonIcon, IonLabel, IonItem } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import {
  timeOutline,
  pauseOutline,
  playOutline,
  flagOutline,
} from 'ionicons/icons';
import getFormattedDuration from 'common/helpers/getFormattedDuration';
import './styles.scss';

type Props = {
  sample: Sample;
};

const Stopwatch: FC<Props> = ({ sample }) => {
  const [, setRefresh] = useState(0);
  const [stopwatchID, setStopwatchID] = useState<any>(null);

  const finishedSurveyTimestamp = sample.metadata.saved;

  const startStopwatch = () => {
    if (finishedSurveyTimestamp) return null;

    const forceRefresh = () => setRefresh(Math.random());

    return setInterval(forceRefresh, 1000);
  };

  const toggleTimer = () => {
    if (finishedSurveyTimestamp) return;

    if (sample.metadata.timerPausedTime) {
      const pausedTime =
        Date.now() - new Date(sample.metadata.timerPausedTime).getTime();

      sample.metadata.pausedTime += pausedTime;
      sample.metadata.timerPausedTime = null;

      sample.save();
      return;
    }

    sample.metadata.timerPausedTime = new Date();
    sample.save();
  };

  const formatTime = () => {
    const startTime = new Date(sample.attrs.startTime).getTime();
    const pauseTime = new Date(sample.metadata.pausedTime).getTime();
    const timestamp = sample.metadata.timerPausedTime
      ? new Date(sample.metadata.timerPausedTime).getTime()
      : Date.now();

    const referenceTime = finishedSurveyTimestamp || timestamp;

    const duration = referenceTime - startTime - pauseTime;

    return <span>{getFormattedDuration(duration)}</span>;
  };

  const initComponentRefresh = () => {
    setStopwatchID(startStopwatch());

    // eslint-disable-next-line @getify/proper-arrows/name
    return () => {
      clearInterval(stopwatchID);
      setStopwatchID(null);
    };
  };
  useEffect(initComponentRefresh, []);

  let detailIcon = pauseOutline;
  const isTimerPaused = sample.isTimerPaused();

  if (!isTimerPaused) {
    detailIcon = pauseOutline;
  }
  if (sample.metadata.saved) {
    detailIcon = flagOutline;
  } else if (isTimerPaused) {
    detailIcon = playOutline;
  }

  return (
    <IonItem
      detail
      detailIcon={detailIcon}
      onClick={toggleTimer}
      id="stopwatch"
    >
      <IonIcon icon={timeOutline} slot="start" />
      <IonLabel>
        <T>Duration</T>
      </IonLabel>
      <IonLabel slot="end">{formatTime()}</IonLabel>
    </IonItem>
  );
};

export default observer(Stopwatch);
