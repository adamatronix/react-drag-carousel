import React, { useRef } from 'react';
import DragCarousel from './DragCarousel';
import { generatePhotoPlaceholderURL } from 'react-placeholder-image';


export default {
  title: 'DragCarousel',
  component: DragCarousel
};

const imageArray = new Array(10).fill();

export const Default = () => {
  
  return (
    <>
      <DragCarousel>
      { imageArray.map((item, index) => {
        const image = generatePhotoPlaceholderURL(600, 600);
          return (
              <img src={image}  style={{pointerEvents: 'none', display: 'block', height: '100%'}} />
          )
      })}
      </DragCarousel>
    </>
  );

}