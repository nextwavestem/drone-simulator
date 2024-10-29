/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unknown-property */

import * as THREE from 'three';
import PropTypes from 'prop-types';
import { useGLTF, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { createWait } from './config/droneMovement.js';


const DISTANCE_INCHES_OFFSET = 2.54;
const CIRCLE_RIGHT = 'CIRCLE_RIGHT';
const CIRCLE_LEFT = "CIRCLE_LEFT";
const ARC_RIGHT = 'ARC_RIGHT';
const ARC_LEFT ='ARC_LEFT';
const SECONDS = 'SECONDS';
const INCHES = "INCHES";
const RIGHT = 'RIGHT';
const LEFT = 'LEFT';

export const Drone = React.forwardRef(({ moveDronePosY,
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
    enableMeasurement,
    droneScale,
    cameraOffset
  }, ref) => {

  const isGameMode = window.location.href.includes('game-mode');
  const canMoveInArena = isGameMode || enableMouseControl;
  
  const memoizedDrone = useMemo(() => { return useGLTF('assets/models/drone.glb'); }, []);
  const droneRef = ref || useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({ w: false, a: false, s: false, d: false, u: false, p: false, t: false });
  
  const { camera } = useThree(); 

  const [path, setPath] = useState([new THREE.Vector3(0, 0, 0)]); 
  let droneSpeed = 0.05

  useEffect(() => {
    const handleKeyDown = (event) => {
      keys.current[event.key] = true;
    };
    
    const handleKeyUp = (event) => {
      keys.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

    //intersection check
  }, [keys]);

  const updateDroneMovement = () => {
    velocity.current.set(0, 0, 0);

    // Calculate the forward direction based on the drone's current rotation
    const forwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(droneRef.current.quaternion); // Apply current drone rotation
    const backwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(droneRef.current.quaternion); // Apply current drone rotation
    const leftDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(droneRef.current.quaternion); // Apply current drone rotation
    const rightDirection = new THREE.Vector3(-1, 0, 0).applyQuaternion(droneRef.current.quaternion); // Apply current drone rotation

    if (keys.current.w) velocity.current.add(forwardDirection.multiplyScalar(droneSpeed)); // Forward
    if (keys.current.s) velocity.current.add(backwardDirection.multiplyScalar(droneSpeed)); // Backward
    if (keys.current.a) velocity.current.add(leftDirection.multiplyScalar(droneSpeed)); // left
    if (keys.current.d) velocity.current.add(rightDirection.multiplyScalar(droneSpeed)); // right

    if (keys.current.z) droneRef.current.rotation.y += THREE.MathUtils.degToRad(1); // Rotate left
    if (keys.current.c) droneRef.current.rotation.y -= THREE.MathUtils.degToRad(1); // Rotate right

    if (keys.current.u) velocity.current.y += droneSpeed; // Up
    if (keys.current.p) velocity.current.y -= droneSpeed; // Down

    droneRef.current.position.add(velocity.current);

    // Update camera to follow drone
    if (!canMoveInArena && !enableMeasurement) {
      const [cameraOffsetX, cameraOffsetY, cameraOffsetZ] = cameraOffset;
      const cameraView = new THREE.Vector3(cameraOffsetX, cameraOffsetY, cameraOffsetZ); // Camera position relative to the drone
      cameraView.applyQuaternion(droneRef.current.quaternion); // Apply the drone's rotation to the camera
      camera.position.copy(droneRef.current.position.clone().add(cameraView));
      camera.lookAt(droneRef.current.position); // Ensure the camera keeps looking at the drone
    }

    // Update the path the drone follows
    const currentPosition = droneRef.current.position.clone();
    setPath((prevPath) => [...prevPath, currentPosition]);
    if(setDronePosition) {
      setDronePosition({ 
      xPos: droneRef.current.position.x, 
      yPos: droneRef.current.position.y, 
      zPos: droneRef.current.position.z, 
      xRot: droneRef.current.rotation.x,
      yRot: droneRef.current.rotation.y, 
      zRot: droneRef.current.rotation.z });
    }
  };

  const rotateDrone = (value) => {
    const [direction, degrees, radius, unit] = value;
    const radians = THREE.MathUtils.degToRad(degrees/60);

    if(direction == CIRCLE_LEFT || direction == ARC_LEFT) {  
      droneRef.current.rotation.y += radians;
      moveDrone(new THREE.Vector3(0, 0, 1), [radius, unit]);
    }

    if(direction == CIRCLE_RIGHT || direction == ARC_RIGHT) {
      droneRef.current.rotation.y -= radians;
      moveDrone(new THREE.Vector3(0, 0, 1), [radius, unit]);
    }

    if (direction === LEFT) droneRef.current.rotation.y += radians;
    if (direction === RIGHT) droneRef.current.rotation.y -= radians; 
  };

  const moveContinuous = (directionVector, seconds) => {
    const distancePerFrame = 0.0001;
    const frameTime = 1000 / 60; 
    let elapsedTime = 0;
    const totalTime = seconds * 1000; 
    const direction = directionVector.applyQuaternion(droneRef.current.quaternion); 
    
    const moveStep = () => {
      droneRef.current.position.add(direction.clone().multiplyScalar(distancePerFrame));
      elapsedTime += frameTime;
      if (elapsedTime < totalTime) setTimeout(moveStep, frameTime); 
    };
    
    moveStep();
  };
  
  const moveDrone = (directionVector, [distance, unit]) => {
    console.log("moving..")
    const newPosition = unit === INCHES ? distance * DISTANCE_INCHES_OFFSET : distance;
    const distanceInThreeJsUnits = newPosition / 100;
    
    const direction = directionVector.clone().normalize().applyQuaternion(droneRef.current.quaternion);
    droneRef.current.position.add(direction.multiplyScalar(distanceInThreeJsUnits));
  };
  
  // Movement functions using the generalized moveDrone function
  const moveNegX = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(1, 0, 0),  params[0]) : moveDrone(new THREE.Vector3(1, 0, 0),  params); 
  const movePosX = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(-1, 0, 0), params[0]) : moveDrone(new THREE.Vector3(-1, 0, 0), params);
  const movePosY = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(0, 1, 0),  params[0]) : moveDrone(new THREE.Vector3(0, 1, 0),  params);
  const moveNegY = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(0, -1, 0), params[0]) : moveDrone(new THREE.Vector3(0, -1, 0), params);
  const movePosZ = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(0, 0, 1),  params[0]) : moveDrone(new THREE.Vector3(0, 0, 1),  params);
  const moveNegZ = (params) => params[1] == SECONDS ? moveContinuous(new THREE.Vector3(0, 0, -1), params[0]) : moveDrone(new THREE.Vector3(0, 0, -1), params);
  
  useFrame(() => {
    if (!droneRef.current) return;

    // Custom key-based movements
    if (moveDronePosY) movePosY(moveDronePosY);
    if (moveDroneNegY) moveNegY(moveDroneNegY);
    if (moveDronePosZ) movePosZ(moveDronePosZ);
    if (moveDroneNegZ) moveNegZ(moveDroneNegZ);
    if (moveDronePosX) movePosX(moveDronePosX);
    if (moveDroneNegX) moveNegX(moveDroneNegX);
    if (rotate) rotateDrone(rotate);
    if (waitTime) createWait(waitTime);
    if (speed) droneSpeed = speed;

    updateDroneMovement();
  });

  return (
    <>
      <mesh ref={droneRef}>
        <primitive 
          object={memoizedDrone.scene} 
          position={[0, 0, 0]} 
          scale={droneScale} 
          rotation={[0, 0, 0]} 
        />
      </mesh>
      <Line
        points={path} 
        color="yellow" 
        lineWidth={3} 
      />
    </>
  );
});

Drone.propTypes = {
  enableMouseControl: PropTypes.any,
  setDronePosition: PropTypes.func,
  moveDronePosY: PropTypes.any, 
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any, 
  moveDroneNegZ: PropTypes.any,
  moveDronePosX: PropTypes.any, 
  moveDroneNegX: PropTypes.any,
  controlsRef: PropTypes.any,
  waitTime: PropTypes.any, 
  speed: PropTypes.any,
  rotate: PropTypes.any,
  buildings: PropTypes.any,
  enableMeasurement: PropTypes.any,
  droneScale: PropTypes.any,
  cameraOffset: PropTypes.any
};
