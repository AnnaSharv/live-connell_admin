import React from 'react';


const SelectedImage = ({ photo, onClose, toggleSelection }) => {
  return (
    <div>
      <img src={photo.src} alt="" />
      <button onClick={toggleSelection}>
        {photo.isSelected ? "Deselect" : "Select"}
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
export default SelectedImage;
