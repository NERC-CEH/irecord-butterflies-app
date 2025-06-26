import { observer } from 'mobx-react';
import { useRouteMatch } from 'react-router';
import { Attr, Main, MenuAttrItem, MenuAttrItemFromModel } from '@flumens';
import { IonList, IonItem, IonAvatar } from '@ionic/react';
import PhotoPicker from 'common/Components/PhotoPicker';
import species, { Species, byIdsAndName } from 'common/data/species';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import numberIcon from 'common/images/number.svg';
import Occurrence from 'models/occurrence';
import VerificationMessage from 'Survey/common/Components/VerificationMessage';

type Props = {
  occurrence: Occurrence;
};

const OccurrenceHomeMain = ({ occurrence }: Props) => {
  const match = useRouteMatch();

  const { isDisabled } = occurrence;

  const getSpeciesButton = () => {
    const { taxon } = occurrence.data;
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

    const fullSpeciesProfile = species.find(byIdsAndName(taxon)) as Species;

    const { commonName, scientificName, thumbnail } = fullSpeciesProfile;

    return (
      <IonItem
        className="menu-attr-item species-item"
        routerLink={!isDisabled ? `${match.url}/species` : undefined}
        detail={!isDisabled}
      >
        <IonAvatar className="shrink-0">
          <img src={thumbnail} />
        </IonAvatar>
        <div className="flex w-full flex-col items-end justify-center gap-1">
          <div>
            <b>{commonName}</b>
          </div>
          <div>
            <i>{scientificName}</i>
          </div>
        </div>
      </IonItem>
    );
  };

  const showPhotoPicker = !!occurrence.media.length || !isDisabled;

  return (
    <Main>
      <IonList lines="full">
        {isDisabled && (
          <div className="rounded-list mb-2">
            <VerificationMessage occurrence={occurrence} />
          </div>
        )}

        <h3 className="list-title">Details</h3>
        <div className="rounded-list">
          {getSpeciesButton()}

          <Attr
            model={occurrence}
            input="counter"
            inputProps={{
              icon: numberIcon,
              label: 'Number',
              isDisabled,
              min: 1,
            }}
            attr="count"
          />

          <MenuAttrItemFromModel
            model={occurrence}
            attr="stage"
            routerLink={`${match.url}/stage`}
          />
          <MenuAttrItemFromModel
            model={occurrence}
            attr="comment"
            routerLink={`${match.url}/comment`}
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

export default observer(OccurrenceHomeMain);
