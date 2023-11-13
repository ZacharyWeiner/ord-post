import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';

const LocksChart = ({ currentBlockHeight }) => {
    const [chartData, setChartData] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        fetch(`/api/locks-data?blockHeight=${818149}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (chartRef.current && data) {
                    new Chart(chartRef.current, {
                        type: 'bar', // or 'line', 'pie', etc.
                        data: {
                            labels: data.labels,
                            datasets: [{
                                label: 'Number of Locks',
                                data: data.data,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }, [currentBlockHeight]);

    return (
        <div>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default LocksChart;
