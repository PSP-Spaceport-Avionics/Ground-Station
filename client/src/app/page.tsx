'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

import ServerTest from './components/server_test/ServerTest';

interface ApiResponse {
	message: string;
	data: string[];
}

export default function Home() {
	return (
		<div>
			<ServerTest />
		</div>
	);
}
