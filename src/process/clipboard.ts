import { clipboard, ipcMain, IpcMainEvent } from 'electron';
import { ClipboardItem } from '../shared/types';

export class Clipboard {
	private history: ClipboardItem[];
	private count: number;

	public constructor() {
		this.history = [];
		this.count = 0;
	}
	public static init = () => {
		return new Clipboard();
	};

	public listen = () => {
		ipcMain.on('fetch', this.fetchHandler);

		ipcMain.on('tick', this.clipboardHandler);
	};

	private clipboardHandler = (event: IpcMainEvent) => {
		const clipboardText = clipboard.readText();
		const lastItemText = this.history[this.history.length - 1]?.text ?? '';

		if (lastItemText !== clipboardText && Boolean(clipboardText)) {
			const newItem: ClipboardItem = {
				id: this.count++,
				text: clipboardText,
				createdAt: Date.now(),
			};

			this.history.push(newItem);

			event.sender.send('history-update', this.history.slice().reverse());
		}
	};

	private fetchHandler = (event: IpcMainEvent) => {
		event.sender.send('history-update', this.history.slice().reverse());
	};
}
