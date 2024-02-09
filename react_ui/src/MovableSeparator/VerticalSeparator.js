import { useEffect } from 'react';
import './MovableSeparator.css'



function VerticalSeparator(props){

  useEffect(()=>{
    const resizer = document.getElementById('dragMe');

    //We update both values as the chart resize in the bottom part directly on parent element size
    const topSide = resizer.previousElementSibling;
    const bottomSide = resizer.nextElementSibling;


    let x = 0;
    let y = 0;

    let topHeight = 0;
    let bottomHeight = 0;

   
    const mouseDownHandler = function (e) {
      
        x = e.clientX;
        y = e.clientY;
        topHeight = topSide.getBoundingClientRect().height;
        bottomHeight = bottomSide.getBoundingClientRect().height;

    
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

  
    resizer.addEventListener('mousedown', mouseDownHandler);

    const mouseMoveHandler = function (e) {
      
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newTopHeight = ((topHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
        const newBottomHeight = ((bottomHeight -dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
        topSide.style.height = `${newTopHeight}%`;
        bottomSide.style.height = `${newBottomHeight}%`;
        document.body.style.cursor = 'ns-resize';
        topSide.style.userSelect = 'none';
        topSide.style.pointerEvents = 'none';

        bottomSide.style.userSelect = 'none';
        bottomSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        topSide.style.removeProperty('user-select');
        topSide.style.removeProperty('pointer-events');

        topSide.style.removeProperty('user-select');
        topSide.style.removeProperty('pointer-events');

      
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
    
    },[])


    return(
        <div id = "drag_container" >
        <div id = "top" >{props.top}</div>
        <div id = "dragMe" tabIndex="1" className="resizer"></div>
        <div id = "bottom" >{props.bottom}</div>
        </div>
    )
}

export default VerticalSeparator;