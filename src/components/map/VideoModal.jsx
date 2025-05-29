import React from 'react';

const VideoModal = ({ isOpen, onClose, videoUrl, videoTitle }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      zIndex: 1001,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      width: '80%',
      maxWidth: '600px'
    }}>
      <span 
        style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}
        onClick={onClose}
      >
        &times;
      </span>
      <h3>{videoTitle}</h3>
      <video 
        width="100%" 
        controls
        autoPlay
        onEnded={onClose}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoModal;