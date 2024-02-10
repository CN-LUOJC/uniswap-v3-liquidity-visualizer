import { useEffect } from 'react';
import './HorizontalSeparator.css'
import $ from 'jquery';



function HorizontalSeparator(props){

  useEffect(()=>{
    const resizerH = document.getElementById('dragMeH');

    //We update both values as the chart resize in the right part directly on parent element size
    const leftSide = resizerH.previousElementSibling;
    const rightSide = resizerH.nextElementSibling;


    let x = 0;
    let y = 0;

    const max_width = parseInt($(leftSide).css('max-width'));
    const min_width = parseInt($(leftSide).css('min-width'));

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

  
    resizerH.addEventListener('mousedown', mouseDownHandler);

    const mouseMoveHandler = function (e) {
      
        const dx = e.clientX - x;
        const dy = e.clientY - y;

        const newLeftWidth = ((leftWidth + dx) * 100) / resizerH.parentNode.getBoundingClientRect().width;
       
        //const newRightWidth = ((rightWidth -dx) * 100) /resizerH.parentNode.getBoundingClientRect().width;
        const newRightWidth = 99-newLeftWidth;
        if(newLeftWidth < max_width && newLeftWidth > min_width){
          leftSide.style.width = `${newLeftWidth}%`;
          rightSide.style.width = `${newRightWidth}%`;
        }
        document.body.style.cursor = 'ew-resize';
        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';

        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizerH.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');

        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');

      
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

    
    },[])


    return(
        <div id = "drag_container" >
        <div id = "left" >{props.left}</div>
        <div id = "dragMeH"  className="resizerH"></div>
        <div id = "right" >{props.right}</div>
        </div>
    )
}

export default HorizontalSeparator;