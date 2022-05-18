import { FC, useState, useContext } from 'react';
import Sample from 'models/sample';
import {
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonIcon,
  IonList,
  NavContext,
  IonButton,
} from '@ionic/react';
import { observer } from 'mobx-react';
import { Page, Main } from '@apps';
import userModel from 'models/user';
import { Trans as T } from 'react-i18next';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import SavedSamples from 'models/savedSamples';
import Survey from './components/Survey';
import Map from './components/Map';
import './styles.scss';

function byCreateTime(sample1: Sample, sample2: Sample) {
  const date1 = new Date(sample1.metadata.created_on);
  const date2 = new Date(sample2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

type Props = {
  savedSamples: typeof SavedSamples;
};

const UserSurveyComponent: FC<Props> = ({ savedSamples }) => {
  const { navigate } = useContext(NavContext);

  const [segment, setSegment] = useState('pending');

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  const getSamplesList = (uploaded?: boolean) => {
    const byUploadStatus = (sample: Sample) =>
      uploaded ? sample.metadata.synced_on : !sample.metadata.synced_on;

    return savedSamples.filter(byUploadStatus).sort(byCreateTime);
  };

  const getDeleteTip = () => (
    <InfoBackgroundMessage name="showSurveysDeleteTip">
      To delete any surveys swipe it to the left.
    </InfoBackgroundMessage>
  );

  const getSurveys = (surveys: Sample[], uploadIsPrimary?: boolean) => {
    const getSurvey = (sample: Sample) => (
      <Survey
        key={sample.cid}
        sample={sample}
        uploadIsPrimary={uploadIsPrimary}
      />
    );
    const surveysList = surveys.map(getSurvey);

    return surveysList;
  };

  const onUploadAll = () => {
    const isLoggedIn = userModel.isLoggedIn();
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return null;
    }

    return savedSamples.uploadAll();
  };

  const getUploadedSurveys = () => {
    const surveys = getSamplesList(true);

    if (!surveys.length) {
      return (
        <InfoBackgroundMessage name={null}>
          No uploaded surveys
        </InfoBackgroundMessage>
      );
    }

    return (
      <>
        {getSurveys(surveys)}
        {getDeleteTip()}
      </>
    );
  };

  const hasManyPending = () => getSamplesList().length > 5;
  const navigateToPrimarySurvey = () => navigate(`/survey/point`);

  const getPendingSurveys = () => {
    const surveys = getSamplesList(false);

    if (!surveys.length) {
      return (
        <InfoBackgroundMessage name={null}>
          <div>
            You have no finished records.
            <br />
            <br />
            Press
            <IonIcon
              icon={butterflyIcon}
              onClick={navigateToPrimarySurvey}
            />{' '}
            to add.
          </div>
        </InfoBackgroundMessage>
      );
    }

    const withSecondaryUploadButtons = !hasManyPending();

    return (
      <>
        {getSurveys(surveys, withSecondaryUploadButtons)}
        {getDeleteTip()}
      </>
    );
  };

  const getPendingSurveysCount = () => {
    const pendingSurveys = getSamplesList();

    if (!pendingSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="secondary" slot="end">
        {pendingSurveys.length}
      </IonBadge>
    );
  };

  const getUploadedSurveysCount = () => {
    const uploadedSurveys = getSamplesList(true);

    if (!uploadedSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="light" slot="end">
        {uploadedSurveys.length}
      </IonBadge>
    );
  };

  const showingPending = segment === 'pending';
  const showingUploaded = segment === 'uploaded';
  const showingMap = segment === 'map';

  const showUploadAll = hasManyPending();

  return (
    <Page id="home-user-surveys">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonSegment onIonChange={onSegmentClick} value={segment}>
            <IonSegmentButton value="pending">
              <IonLabel className="ion-text-wrap">
                <T>Pending</T>
                {getPendingSurveysCount()}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="uploaded">
              <IonLabel className="ion-text-wrap">
                <T>Uploaded</T>
                {getUploadedSurveysCount()}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="map">
              <IonLabel className="ion-text-wrap">
                <T>Map</T>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <Main>
        {showingPending && showUploadAll && (
          <IonButton
            expand="block"
            size="small"
            className="upload-all-button"
            onClick={onUploadAll}
          >
            Upload All
          </IonButton>
        )}

        {showingPending && <IonList>{getPendingSurveys()}</IonList>}

        {showingUploaded && <IonList>{getUploadedSurveys()}</IonList>}

        {showingMap && <Map />}
      </Main>
    </Page>
  );
};

export default observer(UserSurveyComponent);
