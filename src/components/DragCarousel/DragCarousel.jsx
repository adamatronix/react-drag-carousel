import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { gsap, TweenMax } from "gsap/all";
import { DraggableCore } from 'react-draggable';

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: grab;
  height: ${props => props.height}px;
`

const Cover = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: white;
  z-index: 1;
`

const Set = styled.div`
  position: absolute;
  display: flex;
  height: 100%;
  transform: translate(${props => props.x}, '0');
`

const DragCarousel = (props) => {
  const { children, height } = props;
  const dragStart = useRef();
  const setWidth = useRef();
  const containerRef = useRef();
  const setRefs = useRef([]);

  const [ AllSets, SetAllSets ] = useState([]);
  const [ Loaded, setLoaded ] = useState(false);
  const currentSetPositions = useRef();

  useEffect(() => {
    Promise.all(children.map((child) => {
      return preload(child.props.src);
    })).then(() => {
      setLoaded(true);
      SetAllSets(origArray => [...origArray, createSet(children, 0)]);
      setWidth.current = setRefs.current[0].offsetWidth;
      console.log(containerRef.current.offsetWidth);
    });
  }, []);

  const getTranslateX = (el) => {
    var style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);

    return matrix.m41;
  }

  const getItems = (children) => {
    return children.map((child) => {
      return (
        <DragCarouselItem>{child}</DragCarouselItem>
      )
    })
  }

  const onDragStart = (e) => {
    dragStart.current = e.clientX || e.touches[0].clientX;
    currentSetPositions.current = setRefs.current.map((ref) => {
      return getTranslateX(ref);
    });
  }

  const onDrag = (e) => {
    let currentPos = e.clientX || e.touches[0].clientX;
    let diff = currentPos - dragStart.current;
    setRefs.current.forEach((ref,index) => {
      ref.style.transform = `translate(${currentSetPositions.current[index] + diff}px,0)`;
    })
    
  }

  const onDragEnd = (e) => {
    console.log('end');
  }

  const preload = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  })

  const isEmptySpaceCheck = (diff) => {
    const start = x;
    const end = start + setWidth.current;
    const containerWidth = containerRef.current;

    setRefs.current.forEach((ref,index) => {
      const newPos = currentSetPositions.current[index] + diff;
    })
  }
  

  const createSet = (children, index, x) => {
    return  (
        <Set ref={el => (setRefs.current[index] = el)} x={x || 0}>
          { children ? getItems(children) : null }
        </Set>
      )
  }

  return (
    <DraggableCore 
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragEnd}>
      <Wrapper height={height || 500} ref={containerRef}>
        { !Loaded ? <Cover /> : null }
        { AllSets }
      </Wrapper>
    </DraggableCore>
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