import { nativeImage } from 'electron';
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
	openDevtoolsOnInitial: false,
	appIcon: nativeImage.createFromPath(path.join(__dirname, '/assets/clipboard@8x.png')),
	trayIcon: nativeImage.createFromPath(path.join(__dirname, '/assets/clipboard@1x.png')),
};

export type Config = typeof config;
