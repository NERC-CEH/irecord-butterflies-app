import { FC, useEffect, useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

// eslint-disable-next-line react/no-unstable-nested-components
const VirtualList: FC<any> = ({ itemSize, Item, topPadding = 0, ...props }) => {
  const contentRef = useRef<any>();
  const [listHeight, setListHeight] = useState<number>(1); // some positive number

  const setCurrentContentHeight = () =>
    contentRef.current && setListHeight(contentRef.current.clientHeight);
  useEffect(setCurrentContentHeight, [contentRef.current]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const ItemWithPadding = ({ style, ...itemProps }: any) => (
    <Item
      style={{ ...style, top: style.top + topPadding, height: 'auto' }}
      {...itemProps}
    />
  );

  return (
    <div style={{ height: '100%' }} ref={contentRef}>
      <List
        height={listHeight}
        itemSize={itemSize}
        overscanCount={Math.floor(listHeight / itemSize)}
        width="100%"
        {...props}
      >
        {ItemWithPadding}
      </List>
    </div>
  );
};

export default VirtualList;
