import React, { useEffect, useState } from 'react';
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
import { Line } from 'react-chartjs-2';
import api from '../../../utils/api';

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export default function Body() {
	// Example Data

	interface ApiResponse {
		message: string;
		data: string[];
	}
	const [test, setTest] = useState<ApiResponse | null>(null);

	useEffect(() => {
		api.get<ApiResponse>('/test')
			.then((response) => {
				setTest(response.data);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	}, []);

	const data = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June'],
		datasets: [
			{
				label: 'Sales',
				data: [12, 19, 3, 5, 2, 3],
				borderColor: 'rgba(75, 192, 192, 1)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderWidth: 2,
			},
		],
	};

	// Chart Options
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Monthly Sales Data',
			},
		},
	};

	return (
		<div className='flex flex-1 items-center justify-center text-white'>
			<div className='w-3/4 h-3/4'>
				<Line
					data={data}
					options={options}
				/>
			</div>
		</div>
	);
}
