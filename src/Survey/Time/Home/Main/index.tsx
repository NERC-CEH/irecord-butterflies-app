import React, { FC } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { Main, MenuAttrItem } from '@apps';
import { IonList, IonItemDivider, IonIcon } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { mapOutline, warningOutline } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';

type Props = {
  sample: typeof Sample;
};

const HomeMain: FC<Props> = ({ sample }) => {
  const { url } = useRouteMatch();
  const { area } = sample.attrs.location || {};

  let areaPretty: JSX.Element | string = (
    <IonIcon icon={warningOutline} color="danger" />
  );

  if (Number.isFinite(area) || sample.isGPSRunning()) {
    areaPretty = area ? `${area} m²` : '';
  }

  return (
    <Main>
      <IonList lines="full">
        <IonItemDivider>
          <T>Details</T>
        </IonItemDivider>
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/area`}
            icon={mapOutline}
            label="Area"
            value={areaPretty}
            skipValueTranslation
          />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
