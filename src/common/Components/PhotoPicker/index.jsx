import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { PhotoPicker } from '@flumens';
import { useTranslation } from 'react-i18next';
import Image from 'models/image';
import config from 'common/config';
import utils from './imageUtils';

function AppPhotoPicker({ model }) {
  const { t } = useTranslation();

  const promptOptions = {
    promptLabelHeader: t('Choose a method to upload a photo'),
    promptLabelPhoto: t('Gallery'),
    promptLabelPicture: t('Camera'),
    promptLabelCancel: t('Cancel'),
  };

  async function getImage() {
    const image = await utils.getImage(promptOptions);
    if (!image) {
      return null;
    }

    return utils.getImageModel(Image, image, config.dataPath);
  }

  return (
    <PhotoPicker
      getImage={getImage}
      model={model}
      isDisabled={model.isDisabled()}
    />
  );
}

AppPhotoPicker.propTypes = exact({
  model: PropTypes.object.isRequired,
});

export default AppPhotoPicker;
