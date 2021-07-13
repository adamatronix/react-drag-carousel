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
  transform: translate(${props => props.x}px, 0);
`

const DragCarousel = (props) => {
  const { children, height, auto, direction} = props;
  const dragStart = useRef();
  const setWidth = useRef();
  const containerRef = useRef();
  const setRefs = useRef([]);
  const animatePos = useRef(0);
  const pauseAnimation = useRef(false);
  const autoDirection = useRef(direction || 1);
  const difference = useRef(0);
  const time = useRef(Date.now());
  const storedCoords = useRef({x: null, y: null});
  const velocity = useRef(null);

  const [ AllSets, SetAllSets ] = useState([]);
  const [ Loaded, setLoaded ] = useState(false);
  const currentSetPositions = useRef();

  useEffect(() => {
    Promise.all(children.map((child) => {
      return preload(child.props.src);
    })).then(() => {
      setLoaded(true);
      SetAllSets(origArray => [...origArray, createSet(children)]);
      setWidth.current = setRefs.current[0].offsetWidth;
      //SetAllSets(origArray => [...origArray, createSet(children, 1, 0 - setWidth.current)]);

      if(auto) {
        onAnimationStart(0);
        startAnimation();
      }
      
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
    pauseAnimation.current = true;
    onAnimationStart(e.clientX || e.touches[0].clientX);
    
  }

  const onDrag = (e) => {
    let current = {
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY
    }

    let dy = current.x - storedCoords.current.x;
    let dx = current.y - storedCoords.current.y;

    storedCoords.current.x = e.clientX || e.touches[0].clientX;
    storedCoords.current.y = e.clientY || e.touches[0].clientY;

    velocity.current = calculateVelocity(dx,dy);
    velocity.current.v += 50;
    
    animate(e.clientX || e.touches[0].clientX);
  }

  const onDragEnd = (e) => {
    pauseAnimation.current = false;

    if(difference.current >= 0) {
      autoDirection.current = 1;
    } else {
      autoDirection.current = -1;
    }

    if(auto) {
      animatePos.current = 0;
      onAnimationStart(0);
      startAnimation();
    }
  }

  const startAnimation = () => {
    
    if(!pauseAnimation.current) {
      animate(animatePos.current);
      
      let normalizedV = velocity.current ? Math.round(velocity.current.v) : 1;

      if(normalizedV > 1) {
          velocity.current.v *= 0.9;
      } else {
          normalizedV = 1;
      }
  
      if(autoDirection.current > 0) {
        animatePos.current += normalizedV;
      } else {
        animatePos.current -= normalizedV;
      }
    
    window.requestAnimationFrame(startAnimation);
    }
  }

  const onAnimationStart = (x) => {
    dragStart.current = x;
    currentSetPositions.current = setRefs.current.map((ref) => {
      return getTranslateX(ref);
    });
  }

  const animate = (x) => {

    let currentPos = x;
    let diff = currentPos - dragStart.current;
    difference.current = diff;
    setRefs.current.forEach((ref,index) => {
      let pos = currentSetPositions.current[index] + diff;
      let endPos = pos + setWidth.current; 
      if(pos > 0) {
        let needsFiller = false;
        //console.log(`${index} is past 0`);

        if(currentSetPositions.current.length > 1) {
          needsFiller = currentSetPositions.current.every((position,i)=>{
              return (pos - setWidth.current) !== position + diff;
          });
        } else {
          needsFiller = true;
          
        }

        if(needsFiller) {
          SetAllSets(origArray => [...origArray, createSet(children, pos - setWidth.current)]);
          
        }
        
      }

      if(endPos < containerRef.current.offsetWidth ) {
        //console.log('possible right blank');
        let needsFiller = false;
        //console.log(`${index} is past 0`);

        if(currentSetPositions.current.length > 1) {
          needsFiller = currentSetPositions.current.every((position,i)=>{
              return endPos !== (position + diff);
          });
        } else {
          needsFiller = true;
          
        }

        if(needsFiller) {
          SetAllSets(origArray => [...origArray, createSet(children, endPos)]);
          
        }
      }
      ref.style.transform = `translate(${pos}px,0)`;
    })

    dragStart.current = currentPos;
    currentSetPositions.current = setRefs.current.map((ref) => {
      return getTranslateX(ref);
    });

  }

  const calculateVelocity = (dx,dy) => {
    let newTime = Date.now();  
    let interval = newTime - time.current;
    let velocity = {
        v: Math.sqrt(dx*dx+dy*dy)/interval,
        x: dx / interval,
        y: dy / interval
    } 
    time.current = newTime;
    return velocity;
  }

  const preload = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  })

  /*const isEmptySpaceCheck = (diff) => {
    const start = x;
    const end = start + setWidth.current;
    const containerWidth = containerRef.current;

    setRefs.current.forEach((ref,index) => {
      const newPos = currentSetPositions.current[index] + diff;
    })
  }*/
  

  const createSet = (children, x) => {
    return  (
        <Set ref={el => setRefs.current.push(el)} x={x || 0}>
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