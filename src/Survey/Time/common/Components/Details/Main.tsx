import { observer } from 'mobx-react';
import {
  clipboardOutline,
  thermometerOutline,
  sunnyOutline,
  personOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  MenuAttrItemFromModel,
  NumberInput,
} from '@flumens';
import { IonList, IonLabel, IonItem, IonIcon } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import windIcon from 'common/images/wind.svg';
import Sample from 'models/sample';

type Props = {
  sample: Sample;
  onChangeCounter: (value: number) => void;
};

const MainDetails = ({ sample, onChangeCounter }: Props) => {
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded();
  const { comment, sun, temperature, windDirection, windSpeed, recorders } =
    sample.attrs;

  const species = sample?.samples[0]?.occurrences[0]?.attrs?.taxon?.commonName;

  return (
    <Main>
      <IonList lines="full">
        <h3 className="list-title">
          <T>Details</T>
        </h3>
        <div className="rounded-list">
          {!sample.isSurveyMultiSpeciesTimedCount() && (
            <IonItem detail={false} disabled className="menu-attr-item">
              <IonIcon slot="start" icon={butterflyIcon} />
              <IonLabel>Species</IonLabel>
              <IonLabel slot="end">{species}</IonLabel>
            </IonItem>
          )}

          <MenuAttrItemFromModel
            model={sample as any}
            attr="site"
            skipValueTranslation
            required
          />
          <MenuAttrItemFromModel
            model={sample as any}
            attr="stage"
            skipValueTranslation
          />
          <MenuAttrItem
            routerLink={`${url}/comment`}
            disabled={isDisabled}
            icon={clipboardOutline}
            label="Comment"
            value={comment}
            skipValueTranslation
          />

          {sample.isSurveyMultiSpeciesTimedCount() && (
            <>
              <NumberInput
                label="Recorders"
                onChange={onChangeCounter}
                value={recorders}
                prefix={<IonIcon src={personOutline} className="size-6" />}
                min={1}
                isDisabled={isDisabled}
              />
              <InfoMessage inline>
                Enter the number of recorders of anyone who helped with this
                record - including your own.
              </InfoMessage>
            </>
          )}
        </div>

        <h3 className="list-title">
          <T>Weather details</T>
        </h3>
        <div className="rounded-list">
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

        <h3 className="list-title">
          <T>Photo</T>
        </h3>
        <div className="rounded-list">
          <PhotoPicker model={sample} disableClassifier />
          <InfoMessage inline>
            Representative photo of where the survey was made
          </InfoMessage>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MainDetails);
