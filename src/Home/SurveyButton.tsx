import { useState } from 'react';
import clsx from 'clsx';
import { addOutline, closeOutline, timeOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import butterflyIcon from 'common/images/butterflyIcon.svg';
import listSurveyIcon from 'common/images/listSurveyIcon.svg';

type Props = {
  onPrimarySurvey: any;
  onListSurvey: any;
  onTimedSurvey: any;
};

const SurveyButton = ({
  onPrimarySurvey,
  onListSurvey,
  onTimedSurvey,
}: Props) => {
  const [showOptions, setShowOptions] = useState(false);
  const toggleOptions = () => setShowOptions(!showOptions);

  const onPrimarySurveyWrap = () => {
    setShowOptions(false);
    onPrimarySurvey();
  };
  const onListSurveyWrap = () => {
    setShowOptions(false);
    onListSurvey();
  };
  const onTimedSurveyWrap = () => {
    setShowOptions(false);
    onTimedSurvey();
  };

  return (
    <>
      <div className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 pb-[var(--ion-safe-area-bottom,0)]">
        <button
          onClick={toggleOptions}
          className={clsx(
            '-mb-4 flex h-[70px] w-[65px] flex-col items-center justify-center rounded-md bg-primary-500 p-1 text-white',
            showOptions && 'shadow-md'
          )}
        >
          <IonIcon
            src={showOptions ? closeOutline : butterflyIcon}
            className={clsx(
              'size-12',
              !showOptions && '[--ionicon-stroke-width:10px]'
            )}
          />
          <span>Record</span>
        </button>
      </div>

      {showOptions && (
        <>
          <div className="fixed bottom-3 left-1/2 z-50 w-[200px] -translate-x-1/2 pb-[var(--ion-safe-area-bottom,0)]">
            <button
              className="absolute bottom-10 left-0 flex items-center justify-center rounded-full bg-primary-700 p-2 text-white shadow-md ring-[0.5px] ring-primary-800"
              onClick={onPrimarySurveyWrap}
            >
              <IonIcon
                src={addOutline}
                className="size-10 [--ionicon-stroke-width:24px]"
              />
            </button>
            <button
              className="absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-primary-700 p-2 text-white shadow-md ring-[0.5px] ring-primary-800"
              onClick={onListSurveyWrap}
            >
              <IonIcon src={listSurveyIcon} className="size-10" />
            </button>
            <button
              className="absolute bottom-10 right-0 flex items-center justify-center rounded-full bg-primary-700 p-2 text-white shadow-md ring-[0.5px] ring-primary-800"
              onClick={onTimedSurveyWrap}
            >
              <IonIcon
                src={timeOutline}
                className="size-10 [--ionicon-stroke-width:24px]"
              />
            </button>
          </div>

          <InfoBackgroundMessage
            className="fixed bottom-[20%] left-1/2 z-10 max-w-80 -translate-x-1/2 items-start gap-0 py-8 pr-2 pt-2"
            name="showSurveyOptionsTip"
          >
            <div
              className="flex flex-col gap-6 pt-8 text-left"
              onClick={onPrimarySurveyWrap}
            >
              <div className="flex items-center gap-4">
                <IonIcon
                  src={addOutline}
                  className="size-7 shrink-0 rounded-full bg-primary-700 p-1 text-white shadow-md ring-[0.5px] ring-primary-800 [--ionicon-stroke-width:24px]"
                />
                <span>Add a new record</span>
              </div>
              <div
                className="flex items-center gap-4"
                onClick={onListSurveyWrap}
              >
                <IonIcon
                  src={listSurveyIcon}
                  className="size-7 shrink-0 rounded-full bg-primary-700 p-1 text-white shadow-md ring-[0.5px] ring-primary-800"
                />
                <span>Create a species list survey</span>
              </div>
              <div
                className="flex items-center gap-4"
                onClick={onTimedSurveyWrap}
              >
                <IonIcon
                  src={timeOutline}
                  className="size-7 shrink-0 rounded-full bg-primary-700 p-1 text-white shadow-md ring-[0.5px] ring-primary-800 [--ionicon-stroke-width:24px]"
                />
                <span>Start a timed-count survey</span>
              </div>
            </div>
          </InfoBackgroundMessage>
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            aria-hidden="true"
            onClick={() => setShowOptions(false)}
          />
        </>
      )}
    </>
  );
};

export default SurveyButton;
