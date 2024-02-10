import React from 'react';
import './Charts.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Chart from "chart.js/auto";
import {Scatter} from 'react-chartjs-2'
import MovableDivider from '../MovableDivider/MovableDivider';

import("chartjs-plugin-zoom").then((plugin) => {
  Chart.register(plugin.default);
});



const MAX_PRICE = 10**15;
const MIN_PRICE = 10**-15; 

function round_10(val){
  return Math.round(val/10)*10;
}

function x_amount(sqrtP, positions){
  let x = 0;
  let sqrtPa;
  let sqrtPb;
  let liq;
    for (let pos of positions){
      
        sqrtPb = Math.sqrt(pos.Pb);
        sqrtPa = Math.sqrt(pos.Pa);
        liq = pos.liquidity;
        

        if (sqrtP > sqrtPa && sqrtP <= sqrtPb)
            x += liq * (sqrtPb - sqrtP) / (sqrtP * sqrtPb);
            
        if (sqrtP <= sqrtPa) 
            x += liq * (sqrtPb - sqrtPa) / (sqrtPa * sqrtPb);

    } 
    return x;
}

function y_amount(sqrtP, positions){
  let y = 0
  let sqrtPa;
  let sqrtPb;
  let liq;
    for (let pos of positions){
        sqrtPb = Math.sqrt(pos.Pb);
        sqrtPa = Math.sqrt(pos.Pa);
        liq = pos.liquidity;

        if (sqrtP > sqrtPa && sqrtP <= sqrtPb)
            y += liq * (-sqrtPa +sqrtP);
            
        if (sqrtP > sqrtPb) 
            y += liq * (sqrtPb - sqrtPa);
    }
    return y;
}

function Charts(props){
  
  
  if(props.state === "show_data"){

    let positions = [];
    for(let pos of props.data){
      if(pos.show)
        positions.push(pos);
    }
    
    
   /* let range = {"lower":positions[0].Pa<MIN_PRICE ? MIN_PRICE :positions[0].Pa,
                  "upper":positions[0].Pb>MAX_PRICE ? MAX_PRICE :positions[0].Pb};

    for(let i=1;i<positions.length;i++){
      if(positions[i].Pa < range.lower && positions[i].Pa > MIN_PRICE )
        range.lower = positions[i].Pa

      if(positions[i].Pb > range.upper && positions[i].Pb < MAX_PRICE)
        range.upper = positions[i].Pb
    }*/
    let n = 0;
    let sum = 0;
    for(let i=1;i<positions.length;i++){
      if(positions[i].Pa > MIN_PRICE ){
        n++;
        sum += positions[i].Pa;
      }
      if(positions[i].Pb < MAX_PRICE ){
        n++;
        sum += positions[i].Pb;
      }
    }
    let avg_price = sum/n;

    let prices = [];
    for (let i = avg_price/10; i <= avg_price*10; i+=(i/10)) {
        prices.push(i);
    }


    let x_val = prices.map((price) => {return x_amount(Math.sqrt(price),positions)});
    let y_val = prices.map((price) => {return y_amount(Math.sqrt(price),positions)});
    
    let points_eth = [];
    let points_tokens = [];
    let points_var = [];

    prices.forEach((x, i) => {
      points_eth.push({'x':1/x,'y':x_val[i]})
    });

    prices.forEach((x, i) => {
      points_tokens.push({'x':1/x,'y':y_val[i]})
    });

    points_var.push({'x':1/prices[1],'y':(1/prices[1]-1/prices[0])/(x_val[1]-x_val[0])})
    for(let i=1;i<prices.length;i++){
      points_var.push({'x':1/prices[i],'y':(1/prices[i]-1/prices[i-1])/(x_val[i]-x_val[i-1])})
    }


    let liqData = {
      datasets:[
          {
              label: "ETH",
              showLine:true,
              fill: false,
              backgroundColor: '#ffffff',
              borderColor:"red",
              pointHitRadius: 5,
              yAxisID: 'y',
              data: points_eth
          },
          {
            label: "Tokens",
            showLine:true,
            fill: false,
            backgroundColor: '#ffffff',
            borderColor:"blue",
            pointHitRadius: 5,
            yAxisID: 'y1',
            data: points_tokens
        }
      ]
  }

  let liqOptions = {
    
    maintainAspectRatio: false,
    aspectRatio:1,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true, 
          },
        },
        mode: 'xy',
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
      
      legend: {
          display: false 
      }
  },
    scales: {
        y: {
            display: true,
            title: {
              display: true,
              text: "ETH"
            },
        },
        y1:{
          display: true,
          position:"right",
          title: {
            display: true,
            text: "Tokens"
          },
          grid: {
            drawOnChartArea: false,
          },
      },
        x: {
            display: true,
            title: {
              display: true,
              text: "Price(ETH)"
            },
        },
    }
}

let varData = {
  datasets:[
      {  
          label: "ETH",
          showLine:true,
          fill: false,
          backgroundColor: '#ffffff',
          borderColor:"red",
          pointHitRadius: 5,
          yAxisID: 'y',
          data: points_var
      },
  ]
}

let varOptions = {
maintainAspectRatio: false,
responsive:true,
plugins: {
  zoom: {
        zoom: {
          wheel: {
            enabled: true, 
          },
        },
        mode: 'xy',
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
  legend: {
      display: false 
  }
},
scales: {
    y: {
      type: 'logarithmic',
        display: true,
        title: {
          display: true,
          
          text: "Price variation/ETH"
        },
    },
    x: {
        display: true,
        title: {
          display: true,
          text: "Price(ETH)"
        },
    },
}
}
  
    return(
      <div id="chart_cont">
        <MovableDivider dir = "vertical" first = {<Scatter  data={liqData} options={liqOptions} />}
                              second = {<Scatter  data={varData} options={varOptions} />} 
                              style_first = {{"padding-top":"10px"}} style_second = {{"padding-top":"10px"}}/>

      </div>
    )
  }
  else
    return(
      <></>
    )
}


export default Charts;