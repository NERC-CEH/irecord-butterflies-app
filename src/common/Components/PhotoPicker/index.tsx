import { FC, useState } from 'react';
import {
  PhotoPicker,
  ImageCropper,
  captureImage,
  device,
  useToast,
  saveFile,
} from '@flumens';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import Media from 'models/image';
import Sample from 'models/sample';
import appModel from 'models/app';
import userModel from 'models/user';
import Occurrence from 'models/occurrence';
import config from 'common/config';
import GalleryWithClassification from './GalleryWithClassification';
import ImageWithClassification from './ImageWithClassification';

type URL = string;

type Props = {
  model: Sample | Occurrence;
  disableClassifier?: boolean;
  allowToCrop?: boolean;
};

const AppPhotoPicker: FC<Props> = ({
  model,
  allowToCrop = true,
  disableClassifier = false,
}) => {
  const [editImage, setEditImage] = useState<Media>();
  const toast = useToast();

  const { useSpeciesImageClassifier } = appModel.attrs;
  const useClassifier = !disableClassifier && useSpeciesImageClassifier;

  const identify = (imageModel: Media) => {
    if (useClassifier && device.isOnline && userModel.isLoggedIn()) {
      imageModel.identify().catch(console.error); // don't toast this to user
    }
  };

  async function onAddNew(shouldUseCamera: boolean) {
    try {
      const photoURLs = await captureImage(
        shouldUseCamera ? { camera: true } : { multiple: true }
      );
      if (!photoURLs.length) return;

      const getImageModel = async (image: any) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(image) : image,
          config.dataPath
        );
      const imageModels: Media[] = await Promise.all<any>(
        photoURLs.map(getImageModel)
      );
      model.media.push(...imageModels);
      model.save();

      const canEdit = imageModels.length === 1;
      if (canEdit) {
        setEditImage(imageModels[0]);
        // don't identify until editing is over
        return;
      }

      imageModels.map(identify);
    } catch (e: any) {
      toast.error(e);
    }
  }

  const onDoneEdit = async (imageDataURL: URL) => {
    const image = editImage as Media;

    // overwrite existing file
    const fileName: string = image?.getURL().split('/').pop() as string;
    let savedURL = await saveFile(imageDataURL, fileName);
    savedURL = isPlatform('hybrid')
      ? Capacitor.convertFileSrc(savedURL)
      : savedURL;

    // copy over new image values to existing model to preserve its observability
    const newImageModel = await Media.getImageModel(savedURL, config.dataPath);
    Object.assign(image?.attrs, { ...newImageModel.attrs, species: null });
    image.parent.save();

    setEditImage(undefined);

    identify(image);
  };

  const onCancelEdit = () => setEditImage(undefined);

  const onCropExisting = (media: Media) => {
    if (model.isDisabled()) return;

    setEditImage(media);
  };

  return (
    <>
      <PhotoPicker
        onAddNew={onAddNew}
        model={model}
        Image={useClassifier ? ImageWithClassification : undefined}
        Gallery={useClassifier ? GalleryWithClassification : undefined}
        galleryProps={{ onCrop: onCropExisting }}
        isDisabled={model.isDisabled()}
      />

      {allowToCrop && (
        <ImageCropper
          image={editImage?.getURL()}
          onDone={onDoneEdit}
          onCancel={onCancelEdit}
        />
      )}
    </>
  );
};

export default AppPhotoPicker;
