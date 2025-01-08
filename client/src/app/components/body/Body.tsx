import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { defaults } from 'chart.js';

import zoomPlugin from 'chartjs-plugin-zoom';
import { io } from 'socket.io-client';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	zoomPlugin
);

export default function LiveGraph() {
	const [data, setData] = useState<[number, number][]>([]);
	const chartRef = useRef(null);

	// Set the moving window size
	const windowSize = 20;

	useEffect(() => {
		// Create socket connection
		const socket = io('http://localhost:5000', {
			transports: ['websocket'],
		});

		// Start data stream
		socket.emit('start_stream');

		// Append new data to array
		socket.on('data', (row) => {
			setData((prevData) => [...prevData, row]);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	if (data.length === 0) {
		return <div>Loading...</div>;
	}

	// Calculate the min and max for the visible window
	const xMax = data.length > 0 ? data[data.length - 1][0] : 0;
	const xMin = xMax - windowSize < 0 ? 0 : xMax - windowSize;

	const chartData = {
		labels: data.map((point) => point[0]), // X-axis values (timestamps)
		datasets: [
			{
				data: data.map((point) => point[1]), // Y-axis values
				backgroundColor: '#fbc02d',
				//borderColor: '#fbc02d',
				tension: 0.2,
				pointRadius: 1,
			},
		],
	};
	defaults.font.family = 'Roboto';

	const options = {
		animation: {
			duration: 0,
			easing: 'easeOutQuad',
		},
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			zoom: {
				pan: {
					enabled: true,
					mode: 'x',
				},
				zoom: {
					wheel: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					mode: 'x',
				},
				limits: {
					x: {
						min: 0,
						max: data[data.length - 1][0],
						minRange: 5,
					},
				},
			},
		},
		scales: {
			x: {
				type: 'linear',
				title: {
					display: true,
					text: 'TIME',
					color: '#fbc02d',
					font: {
						size: 16,
						family: 'Roboto',
						weight: '400',
					},
					padding: { top: 10 },
				},
				ticks: {
					maxTicksLimit: 10,
					stepSize: 5,
					callback: function (value) {
						return parseFloat(value).toFixed(2);
					},
				},
				grid: {
					drawTicks: true,
					tickLength: 10,
					color: '#282c34',
					drawOnChartArea: false,
					tickWidth: 3,
				},
				min: xMin,
				max: xMax,
				border: {
					display: true,
					color: '#282c34',
					width: 3,
				},
			},
			y: {
				title: {
					display: true,
					text: 'ALTITUDE',
					color: '#fbc02d',
					font: {
						size: 16,
						family: 'Roboto',
						weight: '400',
					},
					padding: { bottom: 10 },
				},
				grid: {
					drawTicks: true,
					tickLength: 10,
					color: '#282c34',
					drawOnChartArea: false,
					tickWidth: 3,
				},
				border: {
					display: true,
					color: '#282c34',
					width: 3,
				},
				min: 0,
				max: 4000,
			},
		},
	};

	return (
		<div className='flex flex-row h-full'>
			<div className='flex items-center justify-center my-20 h-5/6 w-8/12 ml-20'>
				<Line
					ref={chartRef}
					data={chartData}
					options={options}
				/>
			</div>
			<div className='flex items-center justify-center border border-white mr-20 w-1/4'>
				Toggle Feet/Meters <br />
				Download Graph
			</div>
		</div>
	);
}
