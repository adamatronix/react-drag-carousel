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
`

const DragCarousel = (props) => {
  const { children, height } = props;
  const dragStart = useRef();
  const setRefs = useRef([]);

  const [ NextSet, setNextSet ] = useState();
  const [ Loaded, setLoaded ] = useState(false);
  const currentSetPosition = useRef();

  useEffect(() => {
    Promise.all(children.map((child) => {
      return preload(child.props.src);
    })).then(() => {
      console.log(setRefs.current[0].offsetWidth);
      setLoaded(true);
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
    currentSetPosition.current = getTranslateX(setRefs.current[0]);
  }

  const onDrag = (e) => {
    let currentPos = e.clientX || e.touches[0].clientX;
    let diff = currentPos - dragStart.current;
    setRefs.current[0].style.transform = `translate(${currentSetPosition.current + diff}px,0)`;

    setManager();
  }

  const onDragEnd = (e) => {
    console.log('end');
  }

  const preload = (src) => new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = src
  })
  

  const createSet = (children, index) => {
    return  (
        <Set ref={el => (setRefs.current[index] = el)}>
          { children ? getItems(children) : null }
        </Set>
      )
  }

  const setManager = () => {
    console.log('set manager');
  }

  const MainSet = createSet(children, 0);

  return (
    <DraggableCore 
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragEnd}>
      <Wrapper height={height || 500}>
        { !Loaded ? <Cover /> : null }
        { MainSet }
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