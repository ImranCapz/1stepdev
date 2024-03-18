import React, { useEffect, useRef, useState } from 'react';
import TopLoadingBar from 'react-top-loading-bar';
import PropTypes from 'prop-types';

export const TopBarLoading = React.forwardRef(({ initialHeight }, ref) => {
  const topLoadingBarRef = useRef(null);
  const [height, setHeight] = useState(initialHeight || 3);
  const [color, setColor] = useState('#ff9900'); 

  useEffect(() => {
    ref.current = {
      start: (duration = 500) => topLoadingBarRef.current.continuousStart(duration),
      complete: () => topLoadingBarRef.current.complete(),
      setErrorColor: () => setColor('#ff0000'), 
      setHeight,
    };
  }, [ref]);

  return (
    <TopLoadingBar
      ref={topLoadingBarRef}
      color={color}
      height={height}
    />
  );
});

TopBarLoading.displayName = 'TopBarLoading';

TopBarLoading.propTypes = {
  initialHeight: PropTypes.number,
};

export default TopBarLoading;
