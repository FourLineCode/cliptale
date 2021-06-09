import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { ClipboardItem } from '../../shared/types';

const TICK_SPEED = 500;

export const useClipboardHistory = () => {
	const [history, setHistory] = useState<ClipboardItem[]>([]);

	useEffect(() => {
		ipcRenderer.send('fetch');

		const interval = setInterval(() => {
			ipcRenderer.send('tick');
		}, TICK_SPEED);

		ipcRenderer.on('history-update', (event, args) => {
			setHistory(args);
		});

		return () => {
			clearInterval(interval);
		};
	}, []);

	return history;
};
