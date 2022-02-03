/* eslint-disable no-param-reassign */
import React, { FC, useState, useEffect } from 'react';
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
import './styles.scss';

type Props = {
  sample: typeof Sample;
};

const Stopwatch: FC<Props> = ({ sample }) => {
  const [refresh, setRefresh] = useState(0);
  const [stopwatchID, setStopwatchID] = useState<any>(null);

  const isDisabled = sample.isUploaded();
  const isSurveyFinnished = sample.metadata.saved;

  const startStopwatch = () => {
    if (isSurveyFinnished) return null;

    const forceRefresh = () => setRefresh(Math.random());

    return setInterval(forceRefresh, 1000);
  };

  const toggleTimer = () => {
    if (isSurveyFinnished) return;

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
    const startTime = new Date(sample.attrs.surveyStartTime).getTime();
    const pauseTime = new Date(sample.metadata.pausedTime).getTime();

    const durationTime = sample.metadata.timerPausedTime
      ? new Date(sample.metadata.timerPausedTime).getTime()
      : Date.now();

    const referenceTime = isSurveyFinnished || durationTime;

    const durationInSeconds: any =
      (referenceTime - startTime - pauseTime) / 1000;

    const duration: any = parseInt(durationInSeconds, 10);

    const seconds = duration % 60;
    const getSeconds = seconds > 9 ? seconds : `0${seconds}`;

    const minutes: any = `${Math.floor(durationInSeconds / 60)}`;
    const getMinutes = minutes > 9 ? minutes : `0${minutes}`;

    return <span>{`${getMinutes}:${getSeconds}`}</span>;
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
      detail={!isDisabled}
      detailIcon={detailIcon}
      onClick={toggleTimer}
      disabled={isDisabled}
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
