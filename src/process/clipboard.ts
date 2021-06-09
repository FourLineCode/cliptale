import { clipboard, ipcMain, IpcMainEvent } from 'electron';
import { ClipboardItem } from '../shared/types';

const sample: ClipboardItem[] = [
	{
		id: 1000,
		text: 'A Sample text',
		createdAt: Date.now(),
	},
	{
		id: 1001,
		text: 'A Sample text',
		createdAt: Date.now(),
	},
	{
		id: 1002,
		text: 'A Sample text. A Sample text. A Sample text. A Sample text. A Sample text. A Sample text. A Sample text. A Sample text. A Sample text. ',
		createdAt: Date.now(),
	},
	{
		id: 1003,
		text: 'A Sample text',
		createdAt: Date.now(),
	},
];

export class Clipboard {
	private history: ClipboardItem[];
	private count: number;

	public constructor() {
		this.history = sample;
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
		const clipboardText = clipboard.readText().trim();
		const lastItemText = this.history[this.history.length - 1]?.text ?? '';

		if (lastItemText !== clipboardText && Boolean(clipboardText)) {
			const newItem: ClipboardItem = {
				id: this.count++,
				text: clipboardText.trim(),
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
