import React, { FC, useRef, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { IonIcon, IonLabel, IonItem } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { timeOutline, pauseOutline, playOutline } from 'ionicons/icons';

type Props = {
  sample: typeof Sample;
};

const Stopwatch: FC<Props> = ({ sample }) => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isDisabled = sample.isUploaded();

  // this.metadata.pausedTime
  // this.metadata.startTime

  const countRef: any = useRef(null);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(true);
    const incrementTime = (time: number): number => time + 1;
    const startTimer = () => setTimer(incrementTime);
    countRef.current = setInterval(startTimer, 1000);
  };

  const initStopwatch = () => {
    handleStart();
  };
  useEffect(initStopwatch, []);

  if (isDisabled) return null;

  const handlePause = () => {
    clearInterval(countRef.current);
    setIsPaused(false);
  };

  const handleResume = () => {
    setIsPaused(true);
    const incrementTime = (time: any) => time + 1;
    const resumeTimer = () => setTimer(incrementTime);

    countRef.current = setInterval(resumeTimer, 1000);
  };

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes: any = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    return `${getMinutes} : ${getSeconds}`;
  };

  const toggleTimer = () => {
    if (!isActive && !isPaused) {
      handleStart();
      return;
    }
    if (isPaused) {
      handlePause();
    } else {
      handleResume();
    }
  };

  const detailsIcons = () => {
    if (!isActive && !isPaused) return playOutline;
    if (isPaused) return pauseOutline;

    return playOutline;
  };

  return (
    <IonItem
      detail={!isDisabled}
      detailIcon={detailsIcons()}
      onClick={toggleTimer}
      disabled={isDisabled}
    >
      <IonIcon icon={timeOutline} slot="start" mode="md" />
      <IonLabel>
        <T>Duration</T>
      </IonLabel>
      <IonLabel slot="end">{formatTime()} </IonLabel>
    </IonItem>
  );
};

export default observer(Stopwatch);
