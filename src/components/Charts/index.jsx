import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const Charts = () => {
  const [Cdata, setCData] = useState([]);
  const [Qdata, setQData] = useState({});
  const chartRef = useRef(null);
  const chartRef2 = useRef(null);

  useEffect(() => {
    fetch("https://alfa-leetcode-api.onrender.com/harshsharma3122/contest")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCData(data.contestParticipation); // Update state with fetched data
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  useEffect(() => {
    fetch("https://alfa-leetcode-api.onrender.com/harshsharma3122/solved")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setQData(data); // Update state with the entire fetched data object
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);

  useEffect(() => {
    if (Cdata.length > 0 && chartRef.current) {
      // Data for the line chart
      const labels = Cdata.map(entry => entry.contest.title); // Assuming 'title' is a field in contest
      const ratings = Cdata.map(entry => entry.rating); // Assuming 'rating' is a field in contestParticipation

      // Check if a chart instance already exists and destroy it
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Chart.js setup
      chartRef.current.chart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Contest Ratings',
            data: ratings,
            borderColor: 'white',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    }
  }, [Cdata]);

  useEffect(() => {
    if (Object.keys(Qdata).length > 0 && chartRef2.current) {
      // Data for the doughnut chart
      const solvedData = [Qdata.solvedProblem, Qdata.easySolved, Qdata.mediumSolved, Qdata.hardSolved];

      // Check if a chart instance already exists and destroy it
      if (chartRef2.current.chart) {
        chartRef2.current.chart.destroy();
      }

      // Chart.js setup
      chartRef2.current.chart = new Chart(chartRef2.current, {
        type: 'doughnut',
        data: {
          labels: ["All", "Easy", "Medium", "Hard"],
          datasets: [{
            label: 'Problems Solved',
            data: solvedData,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
              'rgb(20, 60, 89)'
            ],
            hoverOffset: 4
          }]
        }
      });
    }
  }, [Qdata]);

  return (
    <>
      <h1 className='text-4xl text-white font-semibold text-secondary mb-5 text-center'>Leetcode Profile</h1>
      <br />
      <div className="flex flex-col sm:flex-row gap-12 md:gap-20 mx-auto mb-12 md:w-[90%]">
        <div className="h-full w-full md:h-[30vw] md:w-[50vw] relative">
          <h2 className='text-4xl relative left-[10%]  text-white text-center'>Contest Ratings Chart</h2>
          <canvas className='relative mt-5' ref={chartRef} id="myChart"></canvas>
        </div>
        <div className="h-[50%] w-[50%] md:h-[20vw] md:w-[30vw] relative left-[25%] md:left-0">
          <h2 className='text-4xl relative left-[10%] text-white text-center'>Question's Solved</h2>
          <canvas className='relative left-[28%] mt-5' ref={chartRef2} id="myChart2"></canvas>
        </div>
      </div>
    </>
  );
};

export default Charts;
