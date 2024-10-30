/* eslint-disable react/no-unknown-property */
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment,useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import * as THREE from 'three';
import '../../../src/css/egypt.css';
import { Drone } from '../../components/drone/Drone.jsx';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const loader = new FontLoader(); // Create a FontLoader instance;
let GlobalCamera;
let GlobalScene;
let lastPosition = null;
let measurementLineColor = "white";
let measurementPinColor = "black";
let dronePathColor = "yellow"
let launchPadColor = "white"
let planeColor="lightgreen"
let measurementTextColor="black"

const CameraController = ({ enableMeasurement }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (enableMeasurement) {
      // Move camera to top-down view
      camera.position.set(0, 10, 0); // should be (0, 100, 0)
      camera.lookAt(new THREE.Vector3(0, 5, 0));
      camera.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI / 2; // Lock to top-down
        controlsRef.current.minPolarAngle = Math.PI / 2;
        controlsRef.current.enableRotate = false; // Disable rotation
      }
    } else {
      // Reset camera to default view
      camera.position.set(50, 50, 50);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      camera.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.maxPolarAngle = Math.PI; // Allow full rotation
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.enableRotate = true; // Enable rotation
      }
    }
    GlobalCamera = camera;
    GlobalScene = scene;
  }, [enableMeasurement, camera]);

  return (
    <>
      {!enableMeasurement && (
        <OrbitControls ref={controlsRef} args={[camera, gl.domElement]} />
      )}
    </>
  );
};

const Pin = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshStandardMaterial color={measurementPinColor} />
    </mesh>
  );
};

const handleCanvasClick = (event, setPins, enableMeasurement, droneRef) => {
  if (enableMeasurement) {
    const rect = event.target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const vector = new THREE.Vector3(x, y, 0.5);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vector, GlobalCamera);

    // Intersect the scene
    const intersections = raycaster.intersectObject(GlobalScene, true);

    if (intersections.length > 0) {
      const point = intersections[0].point; // Get the intersection point
      setPins((prevPins) => [...prevPins, point]); // Update pin positions

      if (lastPosition == null) {
        lastPosition = droneRef.current.position.clone(); // Clone to avoid reference issues
      }

      // Prepare the coordinates text
      const points = [lastPosition, point];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: measurementLineColor });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      GlobalScene.add(line);
      lastPosition.copy(point);
      const coordinatesText = `X: ${point.x.toFixed(2)}, Y: ${point.y.toFixed(2)}, Z: ${point.z.toFixed(2)}`;
      
      // Display the coordinates at the intersection point
      displayCoordinatesText(coordinatesText, point);
    }
  }
};

const displayCoordinatesText = (text, position) => {
  loader.load('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.1, // Adjust size as needed
      height: 0.01, // Adjust height
      curveSegments: 1,
      bevelEnabled: false,
      bevelThickness: 0.0,
      bevelSize: 0.02,
      bevelSegments: 1,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: measurementTextColor });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y + 0.4, position.z); // Adjust Y position slightly above the line point
    textMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees around the X-axis

    GlobalScene.add(textMesh); // Add the text mesh to the scene
  }, undefined, (error) => {
    console.error('An error occurred loading the font:', error);
  });
};



const Plane = () => {
  const planeRef = useRef();

  // Define the size of the plane
  const planeSize = 11;

  return (
    <>
    <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[planeSize, planeSize]} />
      {/* Blackboard effect: dark color and roughness for a matte finish */}
      <meshStandardMaterial color={planeColor} roughness={0.9} />
    </mesh>

    {/* Landing pads at the corners of the plane */}
    <LandingPad position={[-planeSize / 2, -2, -planeSize / 2]} /> {/* Bottom Left */}
    <LandingPad position={[planeSize / 2,  -2, -planeSize / 2]} />  {/* Bottom Right */}
    <LandingPad position={[-planeSize / 2, -2, planeSize / 2]} />  {/* Top Left */}
    <LandingPad position={[planeSize / 2,  -2, planeSize / 2]} />   {/* Top Right */}
    </>
  );
};


const LandingPad = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 0.1, 1]} /> {/* Width, Height, Depth */}
      <meshStandardMaterial color={launchPadColor} />
    </mesh>
  );
};

const Slate = ({
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
}) => {
  const droneRef = useRef();
  const controlsRef = useRef();
  const [pins, setPins] = useState([]); // State to track pin positions
  
  return (
  <Canvas 
    shadows 
    style={{ background: 'gray' }}
    onClick={(event) => handleCanvasClick(event, setPins, enableMeasurement, droneRef)}>
      <ambientLight intensity={0.4} color={new THREE.Color(0x000000)} /> {/* Warm light color */}
      <Environment preset="sunset" intensity={0.5} /> {/* Adjusted intensity */}
      <Plane />

      {pins.map((pin, index) => ( <Pin key={index} position={pin} /> ))}
      <CameraController enableMeasurement={enableMeasurement} />

      <Drone
        ref={droneRef}
        controlsRef={controlsRef}
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
        droneScale={0.1}
        cameraOffset={[1,1,-4]}
        enableMouseControl={enableMouseControl}
        enableMeasurement={enableMeasurement}
        lineColor={dronePathColor}
      />
  </Canvas>
  );
};

Slate.propTypes = {
  moveDronePosY: PropTypes.any,
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any,
  moveDroneNegZ: PropTypes.any,
  moveDroneTo: PropTypes.any,
  moveDronePosX: PropTypes.any,
  moveDroneNegX: PropTypes.any,
  waitTime: PropTypes.any,
  speed: PropTypes.any,
  setDronePosition: PropTypes.any,
  rotate: PropTypes.any,
  enableMouseControl: PropTypes.any,
  enableMeasurement: PropTypes.any
};

export default Slate;
