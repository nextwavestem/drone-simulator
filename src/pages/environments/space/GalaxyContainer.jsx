import { Canvas } from "@react-three/fiber";
import PropTypes from 'prop-types';

import Galaxy from './Galaxy'
import '../../../css/space.css'

export const GalaxyContainer = ({
    moveDronePosY,
    moveDroneNegY,
    moveDronePosZ,
    moveDroneNegZ,
    moveDronePosX,
    moveDroneNegX,
    waitTime,
    speed,
    setDronePosition,
    rotate,
    enableMouseControl
  }) => {
  return (
      <Canvas >
        <Galaxy 
          moveDronePosY={moveDronePosY}
          moveDroneNegY={moveDroneNegY}
          moveDronePosZ={moveDronePosZ}
          moveDroneNegZ={moveDroneNegZ}
          moveDronePosX={moveDronePosX}
          moveDroneNegX={moveDroneNegX}
          waitTime={waitTime}
          speed={speed}
          setDronePosition={setDronePosition}
          rotate={rotate}
          enableMouseControl={enableMouseControl}
        />
      </Canvas>
  );
};

GalaxyContainer.propTypes = {
  moveDronePosY: PropTypes.any, 
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any, 
  moveDroneNegZ: PropTypes.any,
  moveDronePosX: PropTypes.any, 
  moveDroneNegX: PropTypes.any,
  waitTime: PropTypes.any, 
  speed: PropTypes.any,
  setDronePosition: PropTypes.any,
  rotate: PropTypes.any,
  enableMouseControl: PropTypes.any
};
