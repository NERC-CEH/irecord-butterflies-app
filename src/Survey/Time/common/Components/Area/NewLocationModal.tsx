import { forwardRef, useEffect, useState } from 'react';
import { observable, IObservableArray } from 'mobx';
import clsx from 'clsx';
import { Trans as T, useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import {
  Block,
  Location,
  Main,
  PhotoPicker,
  captureImage,
  getGeomCenter,
  getGeomWKT,
} from '@flumens';
import { isPlatform } from '@ionic/core';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
} from '@ionic/react';
import config from 'common/config';
import Media from 'common/models/image';
import { LocationType, Data as Site, dtoSchema } from 'common/models/location';
import HeaderButton from 'Survey/common/Components/HeaderButton';

export const siteNameAttr = {
  id: 'name',
  type: 'textInput',
  title: 'Site name',
  container: 'inline',
} as const;

export const commentAttr = {
  id: 'comment',
  type: 'textInput',
  title: 'Comments',
  appearance: 'multiline',
  container: 'inline',
} as const;

const useDismissHandler = (newLocation: any) => {
  const { t } = useTranslation();
  const [present] = useIonActionSheet();

  const canDismiss = (force?: boolean) =>
    new Promise<boolean>(resolve => {
      const isEmpty = !newLocation.name && !newLocation.comment;
      if (isEmpty || force) {
        resolve(true);
        return;
      }

      present({
        header: t('Are you sure?'),
        subHeader: t('This will discard the form data.'),
        buttons: [
          { text: t('Yes'), role: 'confirm' },
          { text: t('No'), role: 'cancel' },
        ],
        onWillDismiss: ev => resolve(ev.detail.role === 'confirm'),
      });
    });

  return canDismiss;
};

const getNewSiteSeed = (shape?: Location['shape']): Partial<Site> => {
  const seed: any = {
    locationTypeId: LocationType.GroupSite,
    boundaryGeom: shape ? getGeomWKT(shape) : undefined,
    lat: shape ? `${getGeomCenter(shape)[1]}` : undefined,
    lon: shape ? `${getGeomCenter(shape)[0]}` : undefined,
    centroidSrefSystem: '4326',
    centroidSref: shape
      ? `${getGeomCenter(shape)[1]} ${getGeomCenter(shape)[0]}`
      : undefined,
    name: undefined,
  };

  return seed;
};

type Props = {
  presentingElement: any;
  isOpen: any;
  onCancel: any;
  onSave: (location: Site, photos: Media[]) => Promise<boolean>;
  shape?: Location['shape'];
};

const NewLocationModal = (
  { presentingElement, isOpen, onCancel, onSave, shape }: Props,
  ref: any
) => {
  const [newLocation, setNewLocation] = useState<Partial<Site>>(
    observable(getNewSiteSeed(shape))
  );
  const [photos, setPhotos] = useState<IObservableArray<Media>>(observable([]));

  async function onAddPhoto() {
    const images = await captureImage({ camera: true });
    if (!images.length) return;

    const getImageModel = async (image: any) => {
      const imageModel: any = await Media.getImageModel(
        isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
        config.dataPath,
        true
      );

      return imageModel;
    };

    const imageModels: Media[] = await Promise.all<any>(
      images.map(getImageModel)
    );
    photos.push(imageModels[0]);
    setPhotos(photos);
  }

  const onRemovePhoto = (m: any) => {
    photos.remove(m);
    setPhotos(photos);
  };

  const resetState = () => {
    setPhotos(observable([]));
    setNewLocation(observable(getNewSiteSeed(shape)));
  };
  useEffect(resetState, [shape]);

  const { success: isValidLocation } = dtoSchema.safeParse(newLocation);

  const canDismiss = useDismissHandler(newLocation || {});

  const cleanUp = () => resetState();

  const dismiss = async (force?: boolean) => {
    const closing = await ref.current?.dismiss(force);
    if (closing) onCancel();
  };

  const onSaveWrap = async () => {
    if (!isValidLocation) return;

    const success = await onSave(newLocation as Site, photos);
    if (!success) return;

    dismiss(true);
  };

  const getBlockAttrs = (attrConf: any) => ({
    record: newLocation,
    block: attrConf,
    onChange: (newVal: any) => {
      setNewLocation({ ...newLocation, [attrConf.id]: newVal });
      return null;
    },
  });

  return (
    <IonModal
      ref={ref}
      isOpen={isOpen}
      backdropDismiss={false}
      presentingElement={presentingElement}
      canDismiss={canDismiss}
      onWillDismiss={cleanUp}
      focusTrap={false}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => dismiss()}>
              <T>Cancel</T>
            </IonButton>
          </IonButtons>
          <IonTitle className={clsx(isPlatform('ios') && 'pr-[130px]')}>
            <T>New site</T>
          </IonTitle>
          <IonButtons slot="end">
            <HeaderButton isInvalid={!isValidLocation} onClick={onSaveWrap}>
              Save
            </HeaderButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <Main>
        <div className="m-3 flex flex-col gap-3">
          <div className="rounded-list">
            <Block {...getBlockAttrs(siteNameAttr)} />
            <Block {...getBlockAttrs(commentAttr)} />
          </div>

          <div>
            <h3 className="list-title">
              <T>Site photos</T>
            </h3>
            <div className="rounded-list">
              <PhotoPicker
                onAdd={onAddPhoto}
                onRemove={onRemovePhoto}
                value={photos}
              />
            </div>
          </div>
        </div>
      </Main>
    </IonModal>
  );
};

export default forwardRef(NewLocationModal);
