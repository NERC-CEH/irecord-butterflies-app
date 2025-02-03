import { ReactNode } from 'react';
import { IonBackdrop } from '@ionic/react';

type Props = { children: ReactNode };
const CustomAlert = ({ children }: Props) => (
  <div className="custom-alert">
    <IonBackdrop
      tappable
      visible
      stopPropagation
      className="z-[100] opacity-80"
    />
    <div className="absolute left-2/4 top-2/4 z-[1000] w-[calc(100%_-_40px)] max-w-[400px] -translate-x-2/4 -translate-y-2/4 rounded-[20px] bg-white p-[15px]">
      {children}
    </div>
  </div>
);

export default CustomAlert;
