import React from 'react';
import {
  IonCardHeader,
  IonCardContent,
  IonSlide,
  IonSlides,
} from '@ionic/react';
import ImageWithBackground from 'Components/ImageWithBackground';
import config from 'common/config';
import { Record, Media } from '../../../../esResponse.d';
import './styles.scss';

type Props = {
  record: Record;
};

const statuses = {
  C: 'Unconfirmed',
  R: 'Rejected',
  V: 'Accepted',
};
// Verification status 1: Accepted, Rejected or Unconfirmed
// Verification status 2: Correct, Considered correct, Unable to verify, Incorrect, Not reviewed, or Plausible

function fixIonicSlideBug() {
  // https://github.com/ionic-team/ionic/issues/19641
  // https://github.com/ionic-team/ionic/issues/19638
  // @ts-ignore
  const updateSlides = () => this.update();
  setTimeout(updateSlides, 50);
}

export default function SpeciesProfile({ record }: Props) {
  const date = record.metadata.created_on.split(' ')[0];
  const status = record.identification.verification_status;
  const statusText = statuses[status];

  const commonName = record.taxon.vernacular_name;
  const scientificName = record.taxon.accepted_name;

  const gridRef = record.location.output_sref;
  const surveyName = record.metadata.survey.title;

  const count = record.occurrence.individual_count;
  const stage = record.occurrence.life_stage;

  const getSlides = (media?: Media[]) => {
    if (!media?.length) return null;

    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (image: Media, index: number) => {
      const { path } = image;
      // const showPhotoInFullScreenWrap = () => showPhotoInFullScreen(index);
      const imageURL = `${config.backend.mediaUrl}${path}`;

      return (
        <IonSlide
          key={imageURL}
          // onClick={showPhotoInFullScreenWrap}
          className="species-profile-photo"
        >
          <ImageWithBackground src={imageURL} />
        </IonSlide>
      );
    };

    const slideImage = media?.map(getSlide);

    return (
      <IonSlides
        pager
        options={slideOpts}
        onIonSlidesDidLoad={fixIonicSlideBug}
      >
        {slideImage}
      </IonSlides>
    );
  };

  return (
    <div className="alert-species-profile">
      <div className="gallery">{getSlides(record.occurrence.media)}</div>

      <IonCardHeader>
        <div className="title">
          {commonName && <h1>{commonName}</h1>}
          <h3>
            <i>{scientificName}</i>
          </h3>
        </div>
      </IonCardHeader>

      <IonCardContent>
        <div>
          <span className="record-attribute">Status:</span> {statusText}
        </div>
        <div>
          <span className="record-attribute">Survey:</span> {surveyName}
        </div>
        <div>
          <span className="record-attribute">Date:</span> {date}
        </div>

        <div>
          <span className="record-attribute">Location:</span> {gridRef}
        </div>
        <div>
          <span className="record-attribute">Count:</span> {count}
        </div>
        <div>
          <span className="record-attribute">Stage:</span> {stage}
        </div>
      </IonCardContent>
    </div>
  );
}
