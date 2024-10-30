import { AppContainer } from '../../components/AppContainer.jsx'
import SlateSimulator from "./simulator/SlateSimulator.jsx"; 
import BlockPad from '../../components/blockly/BlockPad.jsx';
import "../../css/droneSlateSimulator.css";
import { useState } from "react";
import ActionButton from "../../components/ActionButton.jsx"


const DroneSlateSimulator = () => {
  const [moveDronePosY, setDronePosY] = useState(null);
  const [moveDroneNegY, setDroneNegY] = useState(null);
  const [moveDronePosZ, setDronePosZ] = useState(null);
  const [moveDroneNegZ, setDroneNegZ] = useState(null);
  const [moveDronePosX, setDronePosX] = useState(null);
  const [moveDroneNegX, setDroneNegX] = useState(null);
  const [moveDroneTo, setDroneTo] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [rotate, setRotate] = useState(null); 
  const [enableMouseControl, setEnableMouseControl] = useState(null); 
  const [enableMeasurement, setEnableMeasurement] = useState(false); 
  const [dronePosition, setDronePosition] = useState({ x: 0, y: 0, z: 0 });

  const moveDronePositiveY = (value) => {
    setDronePosY(value);
    setTimeout(() => setDronePosY(null), 1000); 
  };

  const moveDroneNegativeY = (value) => {
    setDroneNegY(value);
    setTimeout(() => setDroneNegY(null), 1000);
  };

  const moveDronePositiveZ = (value) => {
    setDronePosZ(value);
    setTimeout(() => setDronePosZ(null), 1000); 
  };

  const moveDroneNegativeZ = (value) => {
    setDroneNegZ(value);
    setTimeout(() => setDroneNegZ(null), 1000);
  };

  const moveDronePositiveX = (value) => {
    setDronePosX(value);
    setTimeout(() => setDronePosX(null), 1000);
  };

  const moveDroneNegativeX = (value) => {
    setDroneNegX(value);
    setTimeout(() => setDroneNegX(null), 1000);
  };

  const droneSpeed = (value) => {
    setSpeed(value);
    setTimeout(() => setSpeed(null), 1000);
  };

  const rotateDrone = (value) => {
    setRotate(value);
    setTimeout(() => setRotate(null), 1000);
  }

  const mouseControl = (value) => {
    setEnableMouseControl(value);
    setTimeout(() => setRotate(null), 1000);
  }

  const bufferTime = (value) => {
    setWaitTime(value);
    setTimeout(() => setWaitTime(null), 1000);
  };

  const measurementControl = () => {
    setEnableMeasurement(!enableMeasurement);
  }

  const moveDroneToPos = (value) => {
    setDroneTo(value);
    setTimeout(() => setDroneTo(null), 5000);
  }

  const roundNumber = (number) => {
    return parseInt(number)
  }
  
    return (
      <AppContainer>     
          <div className="simulation-container">
            <div className="blockpad-container">
              <BlockPad 
                moveDronePosY={moveDronePositiveY}
                moveDroneNegY={moveDroneNegativeY}
                moveDronePosZ={moveDronePositiveZ}
                moveDroneNegZ={moveDroneNegativeZ}
                moveDronePosX={moveDronePositiveX}
                moveDroneNegX={moveDroneNegativeX}
                moveDroneTo={moveDroneToPos}
                waitTime={bufferTime}
                rotate={rotateDrone}
                speed={droneSpeed}
                enableMouseControl={mouseControl}
              />
            </div>
            
            <div className="canvas-container">
            <div className="toolbar">
                <div className="row">
                  <div className="column">
                    <span className="coordinate">X: {roundNumber(dronePosition.xPos)} cm </span>
                    <span className="coordinate">Z: {roundNumber(dronePosition.zPos)} cm </span>
                  </div>
                  <div className="column">
                    <span className="coordinate">Altitude: {roundNumber(dronePosition.yPos)} cm </span>
                    <span className="rotation">Yaw: {roundNumber(dronePosition.yRot) * 60}°</span>
                  </div>
                  <div className="column">
                    <ActionButton onClick={measurementControl} title="Measurement" green medium/>
                  </div>
                </div>
              </div>
              <SlateSimulator 
                enableMouseControl={enableMouseControl}
                moveDronePosY={moveDronePosY}
                moveDroneNegY={moveDroneNegY}
                moveDronePosZ={moveDronePosZ}
                moveDroneNegZ={moveDroneNegZ}
                moveDronePosX={moveDronePosX}
                moveDroneNegX={moveDroneNegX}
                moveDroneTo={moveDroneTo}
                rotate={rotate}
                speed={speed}
                waitTime={waitTime}
                setDronePosition={setDronePosition}
                enableMeasurement={enableMeasurement}
              />
            </div>
          </div>
      </AppContainer>
    );
};

export default DroneSlateSimulator;
