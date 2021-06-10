import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import { config } from '../../internal/config';
import { ClipboardItem } from '../../shared/types';

const TICK_SPEED = config.tickSpeed;

export const useClipboardHistory = () => {
	const [history, setHistory] = useState<ClipboardItem[]>([]);

	useEffect(() => {
		ipcRenderer.send('fetch');

		const interval = setInterval(() => {
			ipcRenderer.send('tick');
		}, TICK_SPEED);

		ipcRenderer.on('history-update', (_, args) => {
			setHistory(args);
		});

		return () => {
			clearInterval(interval);
		};
	}, []);

	return history;
};
