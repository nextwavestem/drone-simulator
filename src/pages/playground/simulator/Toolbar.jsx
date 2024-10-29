// Toolbar.jsx
import React from 'react';
import ActionButton from '../../../components/ActionButton.jsx'; // Adjust the import path as necessary

export const Toolbar = ({ dronePosition, measurementControl }) => {
  return (
    <div className="toolbar">
      <div className="row">
        <div className="column">
          <span className="coordinate">X: {Math.round(dronePosition.xPos)} cm </span>
          <span className="coordinate">Z: {Math.round(dronePosition.zPos)} cm </span>
        </div>
        <div className="column">
          <span className="coordinate">Altitude: {Math.round(dronePosition.yPos)} cm </span>
          <span className="rotation">Yaw: {Math.round(dronePosition.yRot) * 60}°</span>
        </div>
        <div className="column">
          <ActionButton onClick={measurementControl} title="Measurement" green medium />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
