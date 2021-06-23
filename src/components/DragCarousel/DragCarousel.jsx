import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap, TweenMax } from "gsap/all";
import { DraggableCore } from 'react-draggable';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: grab;
  height: ${props => props.height}px;
`

const Set = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
`

const DragCarousel = (props) => {
  const { children, height } = props;

  useEffect(() => {

  }, []);

  const getItems = (children) => {
    return children.map((child) => {
      return (
        <DragCarouselItem>{child}</DragCarouselItem>
      )
    })
  }

  return (
    <Wrapper height={height || 500}>
      <Set>
        { children ? getItems(children) : null }
      </Set>
    </Wrapper>
  )
}

export default DragCarousel;


const ItemWrapper = styled.div`
  width: auto;
  height: auto;
  flex-shrink: 0;
  user-select: none;
`
const DragCarouselItem = (props) => {
  const { children } = props;
  return (
    <ItemWrapper>
      { children }
    </ItemWrapper>
  )
}