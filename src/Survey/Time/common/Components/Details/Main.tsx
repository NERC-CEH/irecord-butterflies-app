import { observer } from 'mobx-react';
import {
  clipboardOutline,
  thermometerOutline,
  sunnyOutline,
  personOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  InfoMessage,
  MenuAttrItemFromModel,
  NumberInput,
  Toggle,
} from '@flumens';
import { IonList, IonLabel, IonItem, IonIcon } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import windIcon from 'common/images/wind.svg';
import Sample from 'models/sample';
import MenuGroupAttr from 'Survey/common/Components/MenuGroupAttr';

type Props = {
  sample: Sample;
  onChangeCounter: (value: number | null) => void;
  onChangeSensitivityStatus: (value: boolean) => void;
};

const MainDetails = ({
  sample,
  onChangeCounter,
  onChangeSensitivityStatus,
}: Props) => {
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded;
  const { comment, sun, temperature, windDirection, windSpeed, recorders } =
    sample.data;

  const species = sample?.samples[0]?.occurrences[0]?.data?.taxon?.commonName;

  const isMultiSpecies = sample.isSurveyMultiSpeciesTimedCount();

  const showPhotoPicker = !isDisabled || !!sample.media.length;

  return (
    <Main>
      <IonList lines="full">
        <h3 className="list-title">
          <T>Details</T>
        </h3>
        <div className="rounded-list">
          {!isMultiSpecies && (
            <>
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
            </>
          )}

          <MenuAttrItemFromModel
            model={sample as any}
            attr="locationName"
            skipValueTranslation
            required={!isDisabled && !isMultiSpecies}
          />

          <MenuGroupAttr sample={sample} />
          {isMultiSpecies && (
            <Toggle
              prefix={<IonIcon src={eyeOffOutline} className="size-6" />}
              label="Sensitive"
              defaultSelected={Number.isFinite(sample.data.privacyPrecision)}
              onChange={onChangeSensitivityStatus}
              isDisabled={isDisabled}
            />
          )}
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
          <T>Weather conditions</T>
        </h3>
        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${url}/temperature`}
            disabled={isDisabled}
            icon={thermometerOutline}
            label="Temperature"
            value={temperature}
            skipValueTranslation
            required={!isMultiSpecies}
          />

          <MenuAttrItem
            routerLink={`${url}/sun`}
            disabled={isDisabled}
            icon={sunnyOutline}
            label="Sun"
            value={sun}
            skipValueTranslation
            required={!isMultiSpecies}
          />

          <MenuAttrItem
            routerLink={`${url}/windDirection`}
            disabled={isDisabled}
            icon={windIcon}
            label="Wind Direction"
            value={windDirection}
            required={!isMultiSpecies}
          />

          <MenuAttrItem
            routerLink={`${url}/windSpeed`}
            disabled={isDisabled}
            icon={windIcon}
            label="Wind Speed"
            value={windSpeed}
            required={!isMultiSpecies}
          />
        </div>

        {showPhotoPicker && (
          <>
            <h3 className="list-title">
              <T>Photo</T>
            </h3>
            <div className="rounded-list mb-2">
              <PhotoPicker model={sample} disableClassifier />
              <InfoMessage inline>
                Representative photo of where the survey was made
              </InfoMessage>
            </div>
          </>
        )}
      </IonList>
    </Main>
  );
};

export default observer(MainDetails);
