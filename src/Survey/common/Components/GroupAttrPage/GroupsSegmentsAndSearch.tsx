import { useRef, useState } from 'react';
import clsx from 'clsx';
import { closeOutline, searchOutline } from 'ionicons/icons';
import { Trans as T, useTranslation } from 'react-i18next';
import {
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/react';
import { Button } from 'common/flumens';

type Props = {
  onSearch: (val: string) => void;
  onTypeChange: (val: 'joinable' | 'member') => void;
};

const GroupsSegmentsAndSearch = ({ onSearch, onTypeChange }: Props) => {
  const { t } = useTranslation();

  const searchbarRef = useRef<any>(null);

  const [showSearch, setShowSearch] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const onSearchWrap = (e: any) => {
    setCurrentSearch(e.detail.value);
    onSearch(e.detail.value);
  };

  const [segment, setSegment] = useState<'joinable' | 'member'>('member');

  const onSegmentClickWrap = (e: any) => {
    const newSegment = e.detail.value;
    setSegment(newSegment);
    onTypeChange(newSegment);
  };

  return (
    <IonToolbar className="border-t text-black">
      <div className="flex w-full items-center justify-end gap-2">
        <IonSearchbar
          placeholder={t('Activity name')}
          className={clsx('!py-0 pr-0', !showSearch && 'hidden')}
          onIonChange={onSearchWrap}
          ref={searchbarRef}
          value={currentSearch}
        />

        {!showSearch && (
          <IonSegment
            onIonChange={onSegmentClickWrap}
            value={segment}
            className="mx-0"
          >
            <IonSegmentButton value="member">
              <IonLabel className="ion-text-wrap">
                <T>My activities</T>
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="joinable">
              <IonLabel className="ion-text-wrap">
                <T>All activities</T>
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        )}

        <Button
          fill="clear"
          className="!bg-transparent py-0"
          shape="round"
          onPress={() => {
            setCurrentSearch('');
            setShowSearch(!showSearch);
            onSearch('');

            if (!showSearch)
              setTimeout(() => searchbarRef.current.setFocus(), 300); // searchbar is hidden and needs to "unhide" before we can set focus
          }}
        >
          <IonIcon
            icon={showSearch ? closeOutline : searchOutline}
            className="size-6"
          />
        </Button>
      </div>
    </IonToolbar>
  );
};

export default GroupsSegmentsAndSearch;
