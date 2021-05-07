import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
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
import Survey from './components/Survey';
import './styles.scss';

function byCreateTime(m1, m2) {
  const date1 = new Date(m1.metadata.created_on);
  const date2 = new Date(m2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

@observer
class UserSurveyComponent extends React.Component {
  static contextType = NavContext;

  static propTypes = exact({
    savedSamples: PropTypes.array.isRequired,
  });

  state = {
    segment: 'pending',
  };

  onSegmentClick = e => this.setState({ segment: e.detail.value });

  getSamplesList(uploaded) {
    const { savedSamples } = this.props;

    const byUploadStatus = sample =>
      uploaded ? sample.metadata.synced_on : !sample.metadata.synced_on;

    return savedSamples.filter(byUploadStatus).sort(byCreateTime);
  }

  getSurveys = (surveys, uploadIsPrimary) => {
    const getSurvey = sample => (
      <Survey
        key={sample.cid}
        sample={sample}
        userModel={userModel}
        uploadIsPrimary={uploadIsPrimary}
      />
    );
    const surveysList = surveys.map(getSurvey);

    return surveysList;
  };

  onUploadAll = () => this.props.savedSamples.uploadAll();

  getUploadedSurveys = () => {
    const surveys = this.getSamplesList(true);

    if (!surveys.length) {
      return <InfoBackgroundMessage>No uploaded surveys</InfoBackgroundMessage>;
    }

    return (
      <>
        {this.getSurveys(surveys)}
        {this.getDeleteTip()}
      </>
    );
  };

  getPendingSurveys = () => {
    const surveys = this.getSamplesList(false);

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
              onClick={this.navigateToPrimarySurvey}
            />{' '}
            to add.
          </div>
        </InfoBackgroundMessage>
      );
    }

    const withSecondaryUploadButtons = !this.hasManyPending();

    return (
      <>
        {this.getSurveys(surveys, withSecondaryUploadButtons)}
        {this.getDeleteTip()}
      </>
    );
  };

  getDeleteTip = () => (
    <InfoBackgroundMessage name="showSurveysDeleteTip">
      To delete any surveys swipe it to the left.
    </InfoBackgroundMessage>
  );

  getPendingSurveysCount = () => {
    const pendingSurveys = this.getSamplesList();

    if (!pendingSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="secondary" slot="end">
        {pendingSurveys.length}
      </IonBadge>
    );
  };

  getUploadedSurveysCount = () => {
    const uploadedSurveys = this.getSamplesList(true);

    if (!uploadedSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="light" slot="end">
        {uploadedSurveys.length}
      </IonBadge>
    );
  };

  navigateToPrimarySurvey = () => {
    this.context.navigate(`/survey/point`);
  };

  hasManyPending = () => this.getSamplesList().length > 5;

  render() {
    const { segment } = this.state;

    const showingPending = segment === 'pending';
    const showingUploaded = segment === 'uploaded';

    const showUploadAll = this.hasManyPending();

    return (
      <Page id="home-user-surveys">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonSegment onIonChange={this.onSegmentClick} value={segment}>
              <IonSegmentButton value="pending" checked={showingPending}>
                <IonLabel className="ion-text-wrap">
                  <T>Pending</T>
                  {this.getPendingSurveysCount()}
                </IonLabel>
              </IonSegmentButton>

              <IonSegmentButton value="uploaded" checked={showingUploaded}>
                <IonLabel className="ion-text-wrap">
                  <T>Uploaded</T>
                  {this.getUploadedSurveysCount()}
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
              onClick={this.onUploadAll}
            >
              Upload All
            </IonButton>
          )}

          <IonList>
            {showingPending && this.getPendingSurveys()}
            {showingUploaded && this.getUploadedSurveys()}
          </IonList>
        </Main>
      </Page>
    );
  }
}

export default UserSurveyComponent;
