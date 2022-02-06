import React from "react";
import Chart from "react-apexcharts";

function LineChart(props){
    const state = {
        options: {
            chart: {
                type: 'line',
                height: 160,
                toolbar: {
                    show: false,
                }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            fill: {
                opacity: 0.8,
              },
            colors: ['#E7EAED'],
            title: {
              text: `Exchange rates evolution of "${props.type}" by Month`,
              align: 'left',
              style: {
                fontSize:  '14px',
                fontWeight:  'bold',
                color:' #E7EAED'
              },
            },
            tooltip:{
                show: false,
                opacity: 0
            },
            
            xaxis: {
              categories: props.labels,
              labels:{
                style: {
                    fontSize:  '14px',
                    fontWeight:  'bold',
                    color:' #E7EAED'
                  },
              }
            },
            yaxis: {
                forceNiceScale: true,
                labels:{
                  style: {
                      fontSize:  '14px',
                      fontWeight:  'bold',
                      color:' #E7EAED'
                    },
                    formatter: (value) => { return value.toFixed(2) },
                }
              }
          },
        series: [
          {
            name: props.type,
            data: props.data
          }
        ]
    }
    return (
      <div className="chart-wrapper">
        <div className="row">
          <div className="line-chart">
            <Chart
              options={state.options}
              series={state.series}
              type="line"
              width="500"
            />
          </div>
        </div>
      </div>
    );
}

export default LineChart;