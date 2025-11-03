import React, { useRef, useEffect } from 'react';
import './Gallery.css';

function Gallery() {
  const scrollRef = useRef(null);

  const originalImages = [
    '/images/img2.png',
    '/images/img1.png',
    
    '/images/img3.png',
    '/images/img4.png',
    '/images/img5.png',
    '/images/img6.png',
  ];

  // Doubled for looping effect
  const images = [...originalImages, ...originalImages];

  const handleWheelScroll = (e) => {
    const container = scrollRef.current;
    if (container) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;

      const atEnd =
        container.scrollLeft + container.offsetWidth >= container.scrollWidth;

      if (atEnd) {
        // Wait just a moment before resetting
        setTimeout(() => {
          container.scrollLeft = 0;
        }, 300); // gives a natural pause before looping
      }
    }
  };

  // Optional: reset on resize
  useEffect(() => {
    const container = scrollRef.current;
    const handleResize = () => {
      if (container) container.scrollLeft = 0;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="smooth-gallery">
      
      <div
        className="scroll-container"
        ref={scrollRef}
        onWheel={handleWheelScroll}
      >
        {images.map((img, index) => (
          <div key={index} className="scroll-card">
            <img src={img} alt={`Project preview ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
