import React, { FC } from 'react';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import { observer } from 'mobx-react';
import { IonList, IonIcon, IonItemDivider } from '@ionic/react';
import {
  chatboxOutline,
  locationOutline,
  warningOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import PhotoPicker from 'common/Components/PhotoPicker';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem } from '@apps';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import caterpillarIcon from 'common/images/caterpillar.svg';
import './styles.scss';

type Props = {
  subSample: typeof Sample;
  occurrence: typeof Occurrence;
};

const OccurrenceMain: FC<Props> = ({ subSample, occurrence }) => {
  const { url } = useRouteMatch();
  const isDisabled = subSample.isUploaded();

  const { stage } = occurrence.attrs;
  const { comment } = occurrence.attrs;

  const sampleBaseUrl = url.split('/occ');
  sampleBaseUrl.pop();

  let location;
  if (subSample.hasLoctionMissingAndIsnotLocating()) {
    location = <IonIcon icon={warningOutline} color="danger" />;
  } else {
    location = <GridRefValue sample={subSample} />;
  }

  return (
    <Main id="area-count-occurrence-edit">
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
          <MenuAttrItem
            routerLink={`${url}/stage`}
            disabled={isDisabled}
            icon={caterpillarIcon}
            label="Stage"
            value={stage}
          />
          <MenuAttrItem
            routerLink={`${url}/comment`}
            disabled={isDisabled}
            icon={chatboxOutline}
            label="Comment"
            value={comment}
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