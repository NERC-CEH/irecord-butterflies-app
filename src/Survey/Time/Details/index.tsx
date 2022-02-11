import React, { FC, useContext } from 'react';
import { useRouteMatch } from 'react-router';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import { Page, Header, showInvalidsMessage } from '@apps';
import { NavContext, IonButton } from '@ionic/react';
import BackCancelButton from '../../common/Components/CancelBackButton';
import Main from './Main';

type Props = {
  sample: typeof Sample;
};

const DetailsController: FC<Props> = ({ sample }) => {
  const { navigate } = useContext(NavContext);
  const { url } = useRouteMatch();
  const hasTimerStarted = sample.attrs.startTimerTimestamp;

  const onStartTimer = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      showInvalidsMessage(invalids);
      return;
    }

    // eslint-disable-next-line no-param-reassign
    sample.attrs.startTimerTimestamp = new Date();
    sample.save();

    const path = url.replace('/details', '');
    navigate(path, 'forward', 'replace');
  };

  const isDisabled = sample.isUploaded();

  const startTimerButton =
    !hasTimerStarted || isDisabled ? (
      <IonButton
        onClick={onStartTimer}
        color="primary"
        fill="solid"
        shape="round"
      >
        {!hasTimerStarted ? 'Start Count' : null}
      </IonButton>
    ) : null;

  const BackCancelButtonWrap = () => <BackCancelButton sample={sample} />;

  return (
    <Page id="single-species-count-detail">
      <Header
        BackButton={!hasTimerStarted ? BackCancelButtonWrap : undefined}
        title="Survey Details"
        rightSlot={startTimerButton}
      />

      <Main sample={sample} />
    </Page>
  );
};

export default observer(DetailsController);
