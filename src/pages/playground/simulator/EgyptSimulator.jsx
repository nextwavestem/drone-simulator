/* eslint-disable react/no-unknown-property */ 
import PropTypes from 'prop-types';
import Egypt from '../../environments/Egypt.jsx' 

function EgyptSimulator({
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
    enableMouseControl,
    enableMeasurement
  }) {
  return (
    <>
      <Egypt 
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
        enableMeasurement={enableMeasurement}
      />
    </>
  );
}

EgyptSimulator.propTypes = {
  enableMouseControl:PropTypes.any,
  setDronePosition: PropTypes.any,
  moveDronePosY: PropTypes.any, 
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any, 
  moveDroneNegZ: PropTypes.any,
  moveDronePosX: PropTypes.any, 
  moveDroneNegX: PropTypes.any,
  waitTime: PropTypes.any, 
  speed: PropTypes.any,
  rotate: PropTypes.any,
  enableMeasurement: PropTypes.any
};

export default EgyptSimulator;
