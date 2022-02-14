import React, { FC, useContext } from 'react';
import { useRouteMatch } from 'react-router';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { Page, Header, showInvalidsMessage } from '@apps';
import { NavContext, IonButton } from '@ionic/react';
import CancelButton from 'Survey/Time/Components/CancelButton';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: typeof Sample;
};

const DetailsController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const hasTimerStarted = sample.attrs.startTime;

  const onStartTimer = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    sample.attrs.startTime = new Date();
    sample.save();

    const path = url.replace('/details', '');
    navigate(path, 'forward', 'replace');
  };

  const startTimerButton = !hasTimerStarted && (
    <IonButton
      onClick={onStartTimer}
      color="primary"
      fill="solid"
      shape="round"
      className="start-count-button"
    >
      Start Count
    </IonButton>
  );

  const CancelButtonWrap = () => <CancelButton sample={sample} />;

  return (
    <Page id="single-species-count-detail">
      <Header
        BackButton={!hasTimerStarted ? CancelButtonWrap : undefined}
        title="Survey Details"
        rightSlot={startTimerButton}
      />

      <Main sample={sample} />
    </Page>
  );
};

export default observer(DetailsController);
