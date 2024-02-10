import { useEffect } from 'react';
import './MovableDivider.css'
import $ from 'jquery';
import { useRef } from 'react';



function MovableDivider(props){

  const dir = props.dir
  const dragMe = useRef(null);
  const divider = useRef(null);
  let div_container_s = "";
  let first_s = "";
  let second_s = "";
  let dragMe_s = "";
  let dragMeLine_s = "";
  let size = "";
  let cursor = "";
    
  if(dir === "horizontal")
  {
    size = "height";
    div_container_s = "drag_containerH"
    first_s = "firstH";
    second_s = "secondH";
    dragMe_s = "dragMeH";
    dragMeLine_s = "dragMeLineH"
    cursor = "ns-resize"
    
  }
  else{

    size = "width";
    div_container_s = "drag_containerV"
    first_s = "firstV";
    second_s = "secondV";
    dragMe_s = "dragMeV";
    dragMeLine_s = "dragMeLineV"
    cursor = "ew-resize"
  }
  

  useEffect(()=>{

    const resizer = divider.current;


    //We update both values as the chart resize in the right part directly on parent element size
    const firstSide = resizer.previousElementSibling;
    const secondSide = resizer.nextElementSibling;

    let x = 0;
    let y = 0;

    const max = parseInt($(firstSide).css('max-'+size));
    const min = parseInt($(firstSide).css('min-'+size));

    let firstSize = 0;
    let secondSize = 0;

    const mouseDownHandler = function (e) {
   
        x = e.clientX;
        y = e.clientY;
        firstSize = firstSide.getBoundingClientRect()[size];
        secondSize = secondSide.getBoundingClientRect()[size];

    
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    //We use the overlaying div for the grabbing
    dragMe.current.addEventListener('mousedown', mouseDownHandler);

    const mouseMoveHandler = function (e) {
      
        let d;
        if(dir === "vertical")
          d = e.clientX - x;
        else
          d = e.clientY - y;

        const newFirstSize = ((firstSize + d) * 100) / resizer.parentNode.getBoundingClientRect()[size];
       
         const newSecondSize = 99-newFirstSize;
        if(newFirstSize < max && newFirstSize > min){
          firstSide.style[size] = `${newFirstSize}%`;
          secondSide.style[size] = `${newSecondSize}%`;
        }
        document.body.style.cursor = cursor;
        firstSide.style.userSelect = 'none';
        firstSide.style.pointerEvents = 'none';

        secondSide.style.userSelect = 'none';
        secondSide.style.pointerEvents = 'none';
    };

    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        firstSide.style.removeProperty('user-select');
        firstSide.style.removeProperty('pointer-events');

        secondSide.style.removeProperty('user-select');
        secondSide.style.removeProperty('pointer-events');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

    },[])

    return(
        <div className = {div_container_s} >
        <div  style = {props.style_first} className = {first_s}>{props.first}</div>
        <div  ref = {divider} style = {props.style_div}  className={dragMeLine_s}  ><div ref = {dragMe} class ={dragMe_s}></div></div>
        <div  style = {props.style_second} className={second_s}>{props.second}</div>
        </div>
    )
}

export default MovableDivider;