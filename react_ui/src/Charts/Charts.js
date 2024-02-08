import React from 'react';
import './Charts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js/auto";
import {Scatter} from 'react-chartjs-2'
//import 'bootstrap/dist/js/bootstrap.min.js'; 
//import 'jquery/dist/jquery.min.js';

const MAX_PRICE = 10000;
const MIN_PRICE = 10; 

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
  
  
  if(props.state === "data"){

    let positions = props.data;
    let range = {"lower":positions[0].Pa<MIN_PRICE ? MIN_PRICE :round_10(positions[0].Pa),
                  "upper":positions[0].Pb>MAX_PRICE ? MAX_PRICE :round_10(positions[0].Pb)};

    for(let i=1;i<positions.length;i++){
      if(positions[i].Pa < range.lower && positions[i].Pa > MIN_PRICE )
        range.lower = round_10(positions[i].Pa)

      if(positions[i].Pb > range.upper && positions[i].Pb < MAX_PRICE)
        range.upper = round_10(positions[i].Pb)
    }
   

    let prices = [];
    for (let i = range.lower; i <= range.upper; i+=10) {
        prices.push(i);
    }

    let x_val = prices.map((price) => {return x_amount(Math.sqrt(price),positions)});
    let y_val = prices.map((price) => {return y_amount(Math.sqrt(price),positions)});
    
    let points_eth = [];
    let points_tokens = [];

    prices.forEach((x, i) => {
      points_eth.push({'x':2600/x,'y':x_val[i]})
    });

    prices.forEach((x, i) => {
      points_tokens.push({'x':2600/x,'y':y_val[i]})
    });


    let chartData = {
      datasets:[
          {
              
              label: "ETH",
              showLine:true,
              fill: false,
              backgroundColor: '#ffffff',
              borderColor:"red",
              //pointBorderColor:'red' ,
              //pointBackgroundColor: 'red',
              pointBorderWidth: 0,
              pointHoverRadius: 0,
              pointRadius: 0,
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
            //pointBorderColor:'red' ,
            //pointBackgroundColor: 'red',
            pointBorderWidth: 0,
            pointHoverRadius: 0,
            pointRadius: 0,
            pointHitRadius: 5,
            yAxisID: 'y1',
            data: points_tokens
        }
      ]
  }

  let chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
          display: false 
      }
  },
    scales: {
        y: {
          id :"A",
            display: true,
            title: {
              display: true,
              text: "ETH"
            },
        },
        y1:{
          id:"B",
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
  

    return(
      <div id="chart_cont">
        <Scatter id="scatter" data={chartData} options={chartOptions}/>
      </div>
    )
  }
  else
    return(
      <></>
    )
}


export default Charts;