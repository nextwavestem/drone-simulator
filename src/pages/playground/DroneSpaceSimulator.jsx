import { AppContainer } from '../../components/AppContainer.jsx'
import SpaceSimulator from "./simulator/SpaceSimulator.jsx"; 
import BlockPad from '../../components/blockly/BlockPad.jsx';
import "../../css/droneSpaceSimulator.css";
import { useState } from "react";


const DroneSpaceSimulator = () => {
  const [moveDronePosY, setDronePosY] = useState(null);
  const [moveDroneNegY, setDroneNegY] = useState(null);
  const [moveDronePosZ, setDronePosZ] = useState(null);
  const [moveDroneNegZ, setDroneNegZ] = useState(null);
  const [moveDronePosX, setDronePosX] = useState(null);
  const [moveDroneNegX, setDroneNegX] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [waitTime, setWaitTime] = useState(null);
  const [rotate, setRotate] = useState(null); 
  const [enableMouseControl, setEnableMouseControl] = useState(null); 

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
                waitTime={bufferTime}
                rotate={rotateDrone}
                speed={droneSpeed}
                enableMouseControl={mouseControl}
              />
            </div>
            
            <div className="canvas-container">
              <div className="toolbar">
                <div className="position">
                  <span className="coordinate">X: {roundNumber(dronePosition.xPos)} cm </span>
                  <span className="coordinate">Z: {roundNumber(dronePosition.zPos)} cm </span>
                  <span className="coordinate">Altitude: {roundNumber(dronePosition.yPos)} cm </span>
                  <span className="rotation">Yaw: {roundNumber(dronePosition.yRot) * 60}°</span>
                </div>
              </div>
              <SpaceSimulator 
                enableMouseControl={enableMouseControl}
                moveDronePosY={moveDronePosY}
                moveDroneNegY={moveDroneNegY}
                moveDronePosZ={moveDronePosZ}
                moveDroneNegZ={moveDroneNegZ}
                moveDronePosX={moveDronePosX}
                moveDroneNegX={moveDroneNegX}
                rotate={rotate}
                speed={speed}
                waitTime={waitTime}
                setDronePosition={setDronePosition}
              />
            </div>
          </div>
      </AppContainer>
    );
};

export default DroneSpaceSimulator;
