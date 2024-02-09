import { useEffect } from 'react';
import './MovableSeparator.css'



function VerticalSeparator(props){

  useEffect(()=>{
    const resizer = document.getElementById('dragMe');

    //We update both values as the chart resize in the right part directly on parent element size
    const leftSide = resizer.previousElementSibling;
    const rightSide = resizer.nextElementSibling;


    let x = 0;
    let y = 0;

    let leftWidth = 0;
    let rightWidth = 0;

   
    const mouseDownHandler = function (e) {
      
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;
        rightWidth = rightSide.getBoundingClientRect().width;

    
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

  
    resizer.addEventListener('mousedown', mouseDownHandler);

    const mouseMoveHandler = function (e) {
      
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        const newRightWidth = ((rightWidth -dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
        leftSide.style.Width = `${newLeftWidth}%`;
        rightSide.style.Width = `${newRightWidth}%`;
        document.body.style.cursor = 'ns-resize';
        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

      
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
    
    },[])


    return(
        <div id = "drag_container" >
        <div id = "left" >{props.left}</div>
        <div id = "dragMe" tabIndex="1" className="resizer"></div>
        <div id = "right" >{props.right}</div>
        </div>
    )
}

export default VerticalSeparator;