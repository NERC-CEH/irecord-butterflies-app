import { FC } from 'react';
import { PhotoPicker, captureImage, device } from '@flumens';
import { useTranslation } from 'react-i18next';
import { useIonActionSheet, isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import Media from 'models/image';
import Sample from 'models/sample';
import appModel from 'models/app';
import userModel from 'models/user';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import Gallery from './Components/Galery';
import Image from './Components/Image';
import './styles.scss';

export function usePromptImageSource() {
  const { t } = useTranslation();
  const [presentActionSheet] = useIonActionSheet();

  const promptImageSource = (resolve: any) => {
    presentActionSheet({
      buttons: [
        { text: t('Gallery'), handler: () => resolve(false) },
        { text: t('Camera'), handler: () => resolve(true) },
        { text: t('Cancel'), role: 'cancel', handler: () => resolve(null) },
      ],
      header: t('Choose a method to upload a photo'),
    });
  };
  const promptImageSourceWrap = () =>
    new Promise<boolean | null>(promptImageSource);

  return promptImageSourceWrap;
}

type Props = {
  model: Sample | Occurrence;
};

const GalleryWithProps = (props: any) => (
  <Gallery
    useSpeciesImageClassifier={props.useSpeciesImageClassifier}
    isLoggedIn={userModel.isLoggedIn()}
    {...props}
  />
);

const AppPhotoPicker: FC<Props> = ({ model }) => {
  const promptImageSource = usePromptImageSource();

  const isLoggedIn = userModel.isLoggedIn();
  const { useSpeciesImageClassifier } = appModel.attrs;

  async function getImage() {
    const shouldUseCamera = await promptImageSource();
    const cancelled = shouldUseCamera === null;
    if (cancelled) return null;

    const images = await captureImage(
      shouldUseCamera ? { camera: true } : { multiple: true }
    );
    if (!images.length) return null;

    const getImageModel = async (image: any) => {
      const imageModel: any = await Media.getImageModel(
        isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
        config.dataPath
      );

      if (device.isOnline && isLoggedIn && useSpeciesImageClassifier) {
        imageModel.identify();
      }

      return imageModel;
    };
    const imageModels = images.map(getImageModel);
    return Promise.all(imageModels);
  }

  return (
    <PhotoPicker
      getImage={getImage}
      model={model}
      Image={Image}
      Gallery={GalleryWithProps}
      isDisabled={model.isDisabled()}
    />
  );
};

export default AppPhotoPicker;
