import { useEffect } from 'react';
import './VerticalSeparator.css';
import $ from 'jquery';



function VerticalSeparator(props){

  useEffect(()=>{
    const resizer = document.getElementById('dragMe');

    //We update both values as the chart resize in the bottom part directly on parent element size
    const topSide = resizer.previousElementSibling;
    const bottomSide = resizer.nextElementSibling;

    const max_height = parseInt($(topSide).css('max-height'));
    const min_height = parseInt($(topSide).css('min-height'));

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
        //const newBottomHeight = ((bottomHeight -dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
        const newBottomHeight = 99-newTopHeight;
        if(newTopHeight > min_height && newTopHeight < (max_height)){
          topSide.style.height = `${newTopHeight}%`;
          bottomSide.style.height = `${newBottomHeight}%`;
        }
       
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

        bottomSide.style.removeProperty('user-select');
        bottomSide.style.removeProperty('pointer-events');

      
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

          
    },[])


    return(
        <div id = "drag_container" >
        <div id = "top" >{props.top}</div>
        <div id = "dragMe" className="resizer"></div>
        <div id = "bottom" >{props.bottom}</div>
        </div>
    )
}

export default VerticalSeparator;