'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ServerTest from './components/server_test/ServerTest';
import NavBar from './components/navBar/NavBar';
import Body from './components/body/Body';
import Footer from './components/footer/Footer';

interface ApiResponse {
	message: string;
	data: string[];
}

export default function Home() {
	return (
		<div className='flex flex-col h-screen'>
			<NavBar />
			<Body />
			<Footer />
			{/*<ServerTest />*/}
		</div>
	);
}
