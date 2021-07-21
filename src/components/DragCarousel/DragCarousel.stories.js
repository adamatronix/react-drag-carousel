import React, { useRef } from 'react';
import DragCarousel from './DragCarousel';
import { generatePhotoPlaceholderURL } from 'react-placeholder-image';
import brands from './assets/BIT_OD_Header_DT_Logo_2.jpg';

export default {
  title: 'DragCarousel',
  component: DragCarousel
};

const imageArray = new Array(10).fill();

export const Default = () => {
  
  return (
    <>
      <DragCarousel drag auto>
      { imageArray.map((item, index) => {
        const image = generatePhotoPlaceholderURL(600, 600);
          return (
              <img src={image}  style={{pointerEvents: 'none', display: 'block', height: '100%'}} />
          )
      })} 
      </DragCarousel>
      <DragCarousel height={100} direction={-1} drag={false} auto>
        <img src={brands}  style={{pointerEvents: 'none', display: 'block', height: '100%'}} />
        <img src={brands}  style={{pointerEvents: 'none', display: 'block', height: '100%'}} />
      </DragCarousel>
    </>
  );

}