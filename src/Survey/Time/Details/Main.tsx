import React, { FC } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import {
  IonList,
  IonItemDivider,
  IonLabel,
  IonItem,
  IonIcon,
} from '@ionic/react';
import {
  clipboardOutline,
  thermometerOutline,
  sunnyOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { Main, MenuAttrItem, MenuNoteItem, MenuAttrItemFromModel } from '@apps';
import PhotoPicker from 'common/Components/PhotoPicker';
import windIcon from 'common/images/wind.svg';
import butterflyIcon from 'common/images/butterflyIcon.svg';

type Props = {
  sample: typeof Sample;
};

const MainDetails: FC<Props> = ({ sample }) => {
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded();
  const { comment, sun, temperature, windDirection, windSpeed } = sample.attrs;

  const species = sample.samples[0].occurrences[0].attrs.taxon.commonName;

  return (
    <Main>
      <IonList lines="full">
        <IonItemDivider>
          <IonLabel>
            <T>Details</T>
          </IonLabel>
        </IonItemDivider>
        <div className="rounded">
          <IonItem detail={false} disabled className="menu-attr-item">
            <IonIcon slot="start" icon={butterflyIcon} />
            <IonLabel>Species</IonLabel>
            <IonLabel slot="end">{species}</IonLabel>
          </IonItem>

          <MenuAttrItemFromModel
            model={sample as any}
            attr="stage"
            skipValueTranslation
          />

          <MenuAttrItemFromModel
            model={sample as any}
            attr="site"
            skipValueTranslation
            required
          />
        </div>
        <IonItemDivider>
          <IonLabel>
            <T>Weather Conditions</T>
          </IonLabel>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/temperature`}
            disabled={isDisabled}
            icon={thermometerOutline}
            label="Temperature"
            value={temperature}
            skipValueTranslation
            required
          />

          <MenuAttrItem
            routerLink={`${url}/sun`}
            disabled={isDisabled}
            icon={sunnyOutline}
            label="Sun"
            value={sun}
            skipValueTranslation
            required
          />

          <MenuAttrItem
            routerLink={`${url}/windDirection`}
            disabled={isDisabled}
            icon={windIcon}
            label="Wind Direction"
            value={windDirection}
            required
          />

          <MenuAttrItem
            routerLink={`${url}/windSpeed`}
            disabled={isDisabled}
            icon={windIcon}
            label="Wind Speed"
            value={windSpeed}
            required
          />
        </div>

        <IonItemDivider>
          <IonLabel>
            <T>Other</T>
          </IonLabel>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/comment`}
            disabled={isDisabled}
            icon={clipboardOutline}
            label="Comment"
            value={comment}
            skipValueTranslation
          />
        </div>

        <IonItemDivider>
          <IonLabel>
            <T>Photo</T>
          </IonLabel>
        </IonItemDivider>
        <div className="rounded">
          <PhotoPicker model={sample} />
          <MenuNoteItem color="medium">
            Representative photo of where the 'Single species timed count' was
            made
          </MenuNoteItem>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainDetails);
