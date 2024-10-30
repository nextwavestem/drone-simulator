/* eslint-disable react/no-unknown-property */

import { useRef, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { Earth }  from './Earth'
import { Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Sun }  from './Planets'

import { Drone }  from '../../../components/drone/Drone.jsx'
import PropTypes from 'prop-types';

import '../../../css/space.css'

const Galaxy = ({ 
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
    const controlsRef = useRef();

    return (
        <>
            <color attach="background" args={['black']} />
            <AnimatedStars/>
            <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} />
            <ambientLight/>
            
            <Mercury/>
            <Venus/>
            <Earth/>
            <Mars/>
            <Jupiter/>
            <Saturn/>
            <Uranus/>
            <Neptune/>
            <Sun/>
            <Drone 
              controlsRef={controlsRef} 
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
              droneScale={0.2}
              cameraOffset={[0, 6, -10]}
              lineColor={"yellow"}
            />
        </>
    );
};


const AnimatedStars = () => {
    const starsRef = useRef();
    useFrame(() => {
        starsRef.current.rotation.x += 0.0001;
        starsRef.current.rotation.y += 0.0001;
        starsRef.current.rotation.z += 0.0001;
    })
    
    return<Stars ref={starsRef}/>
}

Galaxy.propTypes = {
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
  

export default Galaxy;
