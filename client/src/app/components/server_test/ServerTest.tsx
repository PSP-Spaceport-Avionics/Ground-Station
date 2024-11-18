'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import api from '../../../utils/api';

interface ApiResponse {
	message: string;
	data: string[];
}

function serverTest() {
	const [data, setData] = useState<ApiResponse | null>(null);

	useEffect(() => {
		api.get<ApiResponse>('/data')
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error('Error fetching data:', error);
			});
	}, []);

	return (
		<div>
			<h1>Next.js Frontend</h1>
			{data ? (
				<div>
					<p>{data.message}</p>
					<ul>
						{data.data.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}

export default serverTest;
