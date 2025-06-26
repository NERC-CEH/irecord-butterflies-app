import { observer } from 'mobx-react';
import { locationOutline, warningOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import { IonList, IonIcon } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';
import './styles.scss';

type Props = {
  subSample: Sample;
  occurrence: Occurrence;
};

const OccurrenceMain = ({ subSample, occurrence }: Props) => {
  const { url } = useRouteMatch();
  const isDisabled = subSample.isUploaded;

  const sampleBaseUrl = url.split('/occ');
  sampleBaseUrl.pop();

  let location;
  if (subSample.hasLoctionMissingAndIsnotLocating()) {
    if (!isDisabled) {
      location = <IonIcon icon={warningOutline} color="danger" />;
    }
  } else {
    location = <GridRefValue sample={subSample} />;
  }

  const showPhotoPicker = !!occurrence.media.length || !isDisabled;

  return (
    <Main id="area-count-occurrence-edit">
      <IonList lines="full">
        {isDisabled && (
          <div className="rounded-list mb-2">
            <VerificationMessage occurrence={occurrence} />
          </div>
        )}

        <h3 className="list-title">
          <T>Details</T>
        </h3>
        <div className="rounded-list">
          {subSample.isSurveyMultiSpeciesTimedCount() && (
            <MenuAttrItem
              routerLink={`${url}/taxon`}
              disabled={isDisabled}
              icon={butterflyIcon}
              label="Species"
              value={occurrence.data.taxon.commonName}
            />
          )}

          <MenuAttrItem
            routerLink={`${sampleBaseUrl}/location`}
            disabled={isDisabled}
            icon={locationOutline}
            label="Location"
            value={location}
            skipTranslation
          />

          {subSample.isSurveyMultiSpeciesTimedCount() && (
            <MenuAttrItemFromModel
              model={occurrence}
              attr="stage"
              skipValueTranslation
            />
          )}

          <MenuAttrItemFromModel
            model={occurrence}
            attr="comment"
            skipValueTranslation
          />
        </div>

        {showPhotoPicker && (
          <>
            <h3 className="list-title">Species Photo</h3>
            <div className="rounded-list">
              <PhotoPicker model={occurrence} />
            </div>
          </>
        )}
      </IonList>
    </Main>
  );
};

export default observer(OccurrenceMain);
