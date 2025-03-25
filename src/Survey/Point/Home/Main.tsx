import { observer } from 'mobx-react';
import clsx from 'clsx';
import { locationOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import {
  Attr,
  Main,
  MenuAttrItem,
  InfoMessage,
  MenuAttrItemFromModel,
} from '@flumens';
import { IonList, IonItem, IonAvatar, IonIcon } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import species, { byIdsAndName } from 'common/data/species';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import numberIcon from 'common/images/number.svg';
import Sample from 'models/sample';
import DisabledRecordMessage from 'Survey/common/Components/DisabledRecordMessage';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import MenuDateAttr from 'Survey/common/Components/MenuDateAttr';
import MenuGroupAttr from 'Survey/common/Components/MenuGroupAttr';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';

type Props = {
  sample: Sample;
  isDisabled: boolean;
};

const MainComponent = ({ sample, isDisabled }: Props) => {
  const match = useRouteMatch();

  const getSpeciesButton = () => {
    const [occ] = sample.occurrences;

    const { taxon } = occ.data;
    if (!taxon) {
      return (
        <MenuAttrItem
          routerLink={`${match.url}/species`}
          icon={butterflyIcon}
          label="Species"
          required
        />
      );
    }

    const fullSpeciesProfile: any = species.find(byIdsAndName(taxon));

    const { commonName, scientificName, thumbnail } = fullSpeciesProfile;

    return (
      <IonItem
        className="menu-attr-item species-item"
        routerLink={!isDisabled ? `${match.url}/species` : undefined}
        detail={!isDisabled}
      >
        <div className="flex w-full justify-between">
          <IonAvatar>
            <img src={thumbnail} />
          </IonAvatar>
          <div className="m-0 flex flex-col items-end justify-center text-[var(--form-value-color)]">
            <div>
              <b>{commonName}</b>
            </div>
            <div>
              <i>{scientificName}</i>
            </div>
          </div>
        </div>
      </IonItem>
    );
  };

  const getLocationButton = () => {
    const location = sample.data.location || {};
    const hasLocation = location.latitude;
    const hasName = location.name;
    const empty = !hasLocation || !hasName;

    const value = (
      <div className="m-0 flex flex-col items-end justify-center">
        <GridRefValue sample={sample} requiredMessage="No location" />
        <span>{location.name || 'No site name'}</span>
      </div>
    );

    const isOutsideUK = hasLocation && !location.gridref;
    const inacurate = location.gridref && location.gridref.length <= 5;

    return (
      <>
        <MenuAttrItem
          routerLink={`${match.url}/location`}
          value={value}
          icon={locationOutline}
          label="Location"
          skipValueTranslation
          required
          className={clsx({ empty })}
          disabled={isDisabled}
        />
        {isOutsideUK && !isDisabled && (
          <InfoMessage color="warning">
            Your location is not in the UK, Republic of Ireland, Isle of Man or
            Channel Islands. Please tap on Location to change if necessary.
          </InfoMessage>
        )}
        {inacurate && !isDisabled && (
          <InfoMessage color="warning">
            Please select a more accurate location.
          </InfoMessage>
        )}
      </>
    );
  };

  const [occ] = sample.occurrences;

  const hasPhotos = !!occ.media.length;

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && (
          <div className="rounded-list mb-2">
            <VerificationMessage occurrence={occ} />
          </div>
        )}

        {isDisabled && (
          <div className="rounded-list mb-2">
            <DisabledRecordMessage sample={sample} />
          </div>
        )}

        <h3 className="list-title">Details</h3>
        <div className="rounded-list">
          {getSpeciesButton()}
          <MenuDateAttr record={sample.data} isDisabled={isDisabled} />
          {getLocationButton()}
          <MenuGroupAttr sample={sample} />
        </div>

        <h3 className="list-title">Other</h3>
        <div className="rounded-list">
          <Attr
            model={occ}
            input="counter"
            inputProps={{
              prefix: <IonIcon src={numberIcon} className="size-6" />,
              label: 'Number',
              isDisabled,
              min: 1,
            }}
            attr="count"
          />
          <MenuAttrItemFromModel
            model={occ}
            attr="stage"
            routerLink={`${match.url}/occ/${occ.cid}/stage`}
          />
          <MenuAttrItemFromModel
            model={occ}
            attr="comment"
            routerLink={`${match.url}/occ/${occ.cid}/comment`}
          />
        </div>

        {hasPhotos ||
          (!isDisabled && (
            <>
              <h3 className="list-title">Species Photo</h3>
              <div className="rounded-list">
                <PhotoPicker model={occ} />
              </div>
            </>
          ))}
      </IonList>
    </Main>
  );
};

export default observer(MainComponent);
