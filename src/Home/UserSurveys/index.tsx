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
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Page, Main } from '@flumens';
import userModel from 'models/user';
import { Trans as T } from 'react-i18next';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import VirtualList from 'common/Components/VirtualList';
import SavedSamples from 'models/savedSamples';
import Survey from './components/Survey';
import Map from './components/Map';
import './styles.scss';

// https://stackoverflow.com/questions/47112393/getting-the-iphone-x-safe-area-using-javascript
const rawSafeAreaTop =
  getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0px';
const SAFE_AREA_TOP = parseInt(rawSafeAreaTop.replace('px', ''), 10);
const LIST_PADDING = 90 + SAFE_AREA_TOP;
const LIST_ITEM_HEIGHT = 75 + 10; // 10px for padding

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

  const param: any = useParams();
  const initSegment = param?.id || 'pending';
  const [segment, setSegment] = useState(initSegment);

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

  const onUploadAll = () => {
    const isLoggedIn = userModel.isLoggedIn();
    if (!isLoggedIn) {
      navigate(`/user/login`);
      return null;
    }

    return savedSamples.uploadAll();
  };

  const getSurveys = (surveys: Sample[], showUploadAll?: boolean) => {
    // eslint-disable-next-line react/no-unstable-nested-components
    const Item: FC<{ index: number }> = ({ index, ...itemProps }) => {
      if (showUploadAll && index === 0) {
        const uploadAllButton = (
          <IonButton
            expand="block"
            size="small"
            className="upload-all-button"
            onClick={onUploadAll}
            {...itemProps}
          >
            Upload All
          </IonButton>
        );

        return uploadAllButton;
      }

      const sample = surveys[showUploadAll ? index - 1 : index];

      return (
        <Survey
          key={sample.cid}
          sample={sample}
          uploadIsPrimary={!showUploadAll}
          {...itemProps}
        />
      );
    };

    const itemCount = showUploadAll ? surveys.length + 1 : surveys.length;

    return (
      <VirtualList
        itemCount={itemCount}
        itemSize={LIST_ITEM_HEIGHT}
        Item={Item}
        topPadding={LIST_PADDING}
        bottomPadding={LIST_ITEM_HEIGHT / 2}
      />
    );
  };

  const getUploadedSurveys = () => {
    const surveys = getSamplesList(true);

    if (!surveys.length) {
      return <InfoBackgroundMessage>No uploaded surveys</InfoBackgroundMessage>;
    }

    return (
      <>
        {getSurveys(surveys)}
        {getDeleteTip()}
      </>
    );
  };

  const isFinished = (sample: Sample) => sample.metadata.saved;
  const hasManyPending = () => getSamplesList().filter(isFinished).length > 5;
  const navigateToPrimarySurvey = () => navigate(`/survey/point`);

  const getPendingSurveys = () => {
    const surveys = getSamplesList(false);

    if (!surveys.length) {
      return (
        <InfoBackgroundMessage>
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

    return (
      <>
        {getSurveys(surveys, hasManyPending())}
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
      <IonBadge color="warning" slot="end">
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
        {showingPending && <IonList>{getPendingSurveys()}</IonList>}

        {showingUploaded && <IonList>{getUploadedSurveys()}</IonList>}

        {showingMap && <Map />}
      </Main>
    </Page>
  );
};

export default observer(UserSurveyComponent);
