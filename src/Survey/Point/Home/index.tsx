import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header, useToast } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import SurveyHeaderButton from 'Survey/common/Components/SurveyHeaderButton';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
};

const Home = ({ sample }: Props) => {
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

  const isDisabled = sample.isUploaded();

  return (
    <Page id="survey-point-edit">
      <Header
        title="New Sighting"
        rightSlot={<SurveyHeaderButton onClick={onFinish} sample={sample} />}
        defaultHref="/home/surveys"
      />
      <Main sample={sample} isDisabled={isDisabled} />
    </Page>
  );
};

export default observer(Home);
