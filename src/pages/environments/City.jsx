/* eslint-disable react/no-unknown-property */
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment,useGLTF } from '@react-three/drei';
import React, { useRef, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import * as THREE from 'three';
import '../../css/city.css';
import { Drone } from '../../components/drone/Drone.jsx';
import { Color } from 'three'; // Import Color from three

let GlobalCamera;
let GlobalScene;
let lastPosition = null;

const CameraController = ({ enableMeasurement }) => {
  const { camera, gl, scene } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (enableMeasurement) {
      // Move camera to top-down view
      camera.position.set(5, 25, 0); // should be (0, 100, 0)
      camera.lookAt(new THREE.Vector3(0, 0, 0));
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
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="yellow" />
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

    // Intersect the city model instead of all buildings
    const intersections = raycaster.intersectObject(GlobalScene, true); // true for recursive

    if (intersections.length > 0) {
      const point = intersections[0].point; // Get the intersection point
      setPins((prevPins) => [...prevPins, point]); // Update pin positions

      if (lastPosition == null) {
        lastPosition = droneRef.current.position.clone(); // Clone to avoid reference issues
      }
      const distance = lastPosition.distanceTo(point);

      // Draw a line from the drone to the intersection point
      const points = [lastPosition, point];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 'red' });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      GlobalScene.add(line);
      lastPosition.copy(point); // Update lastPosition to the current intersection point

      // Display the distance near the point
      displayDistanceText(`${distance.toFixed(2)} cm`, point);
    }
  }
};

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const loader = new FontLoader(); // Create a FontLoader instance

const displayDistanceText = (text, position) => {
  loader.load('/node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.5, // Adjust size as needed
      height: 0.09, // Adjust height
      curveSegments: 1,
      bevelEnabled: false,
      bevelThickness: 0.0,
      bevelSize: 0.03,
      bevelSegments: 2,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y + 0.4, position.z); // Adjust Y position slightly above the line point
    textMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees around the X-axis

    GlobalScene.add(textMesh); // Add the text mesh to the scene
  }, undefined, (error) => {
    console.error('An error occurred loading the font:', error);
  });
};



const CityModel = () => {
  // const { scene } = useGLTF('assets/models/egypt/environment.glb'); // Load the GLB model
  const { scene } = useGLTF('assets/models/city/city/city.glb'); // Load the GLB model
  const modelPosition = [-10, 0, -1]; // Set your desired position (x, y, z)
  return <primitive object={scene} position={modelPosition} />;
};

const City = ({
  moveDronePosY,
  moveDroneNegY,
  moveDronePosZ,
  moveDroneNegZ,
  moveDroneTo,
  moveDronePosX,
  moveDroneNegX,
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
    onClick={(event) => handleCanvasClick(event, setPins, enableMeasurement, droneRef)} // Pass click event
  >
      <ambientLight intensity={0.4} color={new THREE.Color(0xffc1a0)} /> {/* Warm light color */}
      <Environment preset="sunset" intensity={0.5} /> {/* Adjusted intensity */}
      <CityModel />

      {pins.map((pin, index) => ( <Pin key={index} position={pin} /> ))}
      <CameraController enableMeasurement={enableMeasurement} />

      <Drone
        ref={droneRef}
        controlsRef={controlsRef}
        moveDronePosY={moveDronePosY}
        moveDroneNegY={moveDroneNegY}
        moveDronePosZ={moveDronePosZ}
        moveDroneNegZ={moveDroneNegZ}
        moveDroneTo={moveDroneTo}
        moveDronePosX={moveDronePosX}
        moveDroneNegX={moveDroneNegX}
        waitTime={waitTime}
        speed={speed}
        setDronePosition={setDronePosition}
        rotate={rotate}
        droneScale={0.1}
        cameraOffset={[0, 6, -10]}
        enableMouseControl={enableMouseControl}
        enableMeasurement={enableMeasurement}
        lineColor={"yellow"}
      />
  
  </Canvas>
  );
};

City.propTypes = {
  moveDronePosY: PropTypes.any,
  moveDroneNegY: PropTypes.any,
  moveDronePosZ: PropTypes.any,
  moveDroneNegZ: PropTypes.any,
  moveDronePosX: PropTypes.any,
  moveDroneNegX: PropTypes.any,
  moveDroneTo: PropTypes.any,
  waitTime: PropTypes.any,
  speed: PropTypes.any,
  setDronePosition: PropTypes.any,
  rotate: PropTypes.any,
  enableMouseControl: PropTypes.any,
  enableMeasurement: PropTypes.any
};

export default City;
