/* eslint-disable react/no-unknown-property */ 
import PropTypes from 'prop-types';
import Slate from '../../environments/Slate.jsx' 

function SlateSimulator({
    moveDronePosY,
    moveDroneNegY,
    moveDronePosZ,
    moveDroneNegZ,
    moveDronePosX,
    moveDroneNegX,
    moveDroneTo,
    waitTime,
    speed,
    setDronePosition,
    rotate,
    enableMouseControl,
    enableMeasurement
  }) {
  return (
    <>
      <Slate 
        moveDronePosY={moveDronePosY}
        moveDroneNegY={moveDroneNegY}
        moveDronePosZ={moveDronePosZ}
        moveDroneNegZ={moveDroneNegZ}
        moveDronePosX={moveDronePosX}
        moveDroneNegX={moveDroneNegX}
        moveDroneTo={moveDroneTo}
        waitTime={waitTime}
        speed={speed}
        setDronePosition={setDronePosition}
        rotate={rotate}
        enableMouseControl={enableMouseControl}
        enableMeasurement={enableMeasurement}
      />
    </>
  );
}

SlateSimulator.propTypes = {
  enableMouseControl:PropTypes.any,
  setDronePosition: PropTypes.any,
  moveDronePosY: PropTypes.any, 
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any, 
  moveDroneNegZ: PropTypes.any,
  moveDronePosX: PropTypes.any, 
  moveDroneNegX: PropTypes.any,
  moveDroneTo: PropTypes.any,
  waitTime: PropTypes.any, 
  speed: PropTypes.any,
  rotate: PropTypes.any,
  enableMeasurement: PropTypes.any
};

export default SlateSimulator;
