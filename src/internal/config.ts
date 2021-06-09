import { app } from 'electron';
import path from 'path';

export const config = {
	dev: process.env.NODE_ENV === 'development',
	window: {
		initialShow: true,
		width: 400,
		height: 500,
		resizable: false,
		frame: false,
		menu: null,
		center: true,
		fullscreenable: false,
		movable: false,
		rounded: true,
		hideMenu: true,
	},
	appIcon: path.join(app.getAppPath(), '/src/assets/clipboard@8x.png'),
	trayIcon: path.join(app.getAppPath(), '/src/assets/clipboard@1x.png'),
};

export type Config = typeof config;
