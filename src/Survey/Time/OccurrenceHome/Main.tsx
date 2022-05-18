import { FC } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { IonList, IonIcon, IonItemDivider } from '@ionic/react';
import { locationOutline, warningOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import PhotoPicker from 'common/Components/PhotoPicker';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';
import clsx from 'clsx';
import './styles.scss';

type Props = {
  subSample: Sample;
  occurrence: Occurrence;
};

const OccurrenceMain: FC<Props> = ({ subSample, occurrence }) => {
  const { url } = useRouteMatch();
  const isDisabled = subSample.isUploaded();

  const sampleBaseUrl = url.split('/occ');
  sampleBaseUrl.pop();

  let location;
  if (subSample.hasLoctionMissingAndIsnotLocating()) {
    location = <IonIcon icon={warningOutline} color="danger" />;
  } else {
    location = <GridRefValue sample={subSample} />;
  }

  return (
    <Main
      id="area-count-occurrence-edit"
      className={clsx(isDisabled && 'disable-top-padding')}
    >
      {isDisabled && <VerificationMessage occurrence={occurrence} />}

      <IonList lines="full">
        <IonItemDivider>
          <T>Details</T>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${sampleBaseUrl}/location`}
            disabled={isDisabled}
            icon={locationOutline}
            label="Location"
            value={location}
            skipTranslation
          />

          <MenuAttrItemFromModel
            model={occurrence}
            attr="comment"
            skipValueTranslation
          />
        </div>

        <IonItemDivider>
          <T>Species Photo</T>
        </IonItemDivider>
        <div className="rounded">
          <PhotoPicker model={occurrence} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(OccurrenceMain);
