import React, { FC, useContext } from 'react';
import { Page, Header, useToast } from '@apps';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import { useUserStatusCheck } from 'models/user';
import Sample, { useValidateCheck } from 'models/sample';
import { IonButton, NavContext } from '@ionic/react';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
};

const Home: FC<Props> = ({ sample }) => {
  const toast = useToast();
  const { navigate } = useContext(NavContext);
  const checkSampleStatus = useValidateCheck(sample);
  const checkUserStatus = useUserStatusCheck();

  const _processSubmission = async () => {
    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isValid = checkSampleStatus();
    if (!isValid) return;

    sample.upload().catch(toast.error);
    navigate(`/home/surveys`, 'root');
  };

  const _processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    appModel.attrs['draftId:point'] = null;
    await appModel.save();

    // eslint-disable-next-line no-param-reassign
    sample.metadata.saved = true;
    sample.save();

    navigate(`/home/surveys`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await _processDraft();
      return;
    }

    await _processSubmission();
  };

  // occurrences are destroyed first before samples
  if (!sample?.occurrences?.[0]) return null;

  const isEditing = sample.metadata.saved;

  const isDisabled = sample.isUploaded();

  const finishButton = isDisabled ? null : (
    <IonButton onClick={onFinish} color="primary" fill="solid" shape="round">
      {isEditing ? 'Upload' : 'Finish'}
    </IonButton>
  );

  return (
    <Page id="survey-point-edit">
      <Header
        title="New Sighting"
        rightSlot={finishButton}
        defaultHref="/home/surveys"
      />
      <Main sample={sample} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(Home);
