import React from 'react';
import {
  IonCardHeader,
  IonCardContent,
  IonSlide,
  IonSlides,
} from '@ionic/react';
import ImageWithBackground from 'Components/ImageWithBackground';
import { Record, Media } from '../../../esResponse.d';

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
  const statusText = statuses[record.identification.verification_status];

  const commonName = record.taxon.vernacular_name;
  const scientificName = record.taxon.accepted_name;

  const gridRef = record.location.output_sref;
  const surveyName = record.metadata.survey.title;

  const count = record.occurrence.individual_count;
  const stage = record.occurrence.life_stage;

  const getSlides = (media?: Media[]) => {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
    };

    const getSlide = (image: Media, index: number) => {
      const { path } = image;
      // const showPhotoInFullScreenWrap = () => showPhotoInFullScreen(index);
      const imageURL = `https://warehouse1.indicia.org.uk/upload/${path}`;

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
        <h3>Date:</h3>
        <p>{date}</p>
        <h3>Survey:</h3>
        <p>{surveyName}</p>
        <h3>Location:</h3>
        <p>{gridRef}</p>
        <h3>Survey:</h3>
        <p>{surveyName}</p>
        <h3>Count:</h3>
        <p>{count}</p>
        <h3>Stage:</h3>
        <p>{stage}</p>
      </IonCardContent>

      <div className="alert-record-status">{statusText}</div>
    </div>
  );
}
