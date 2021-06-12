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
	tickSpeed: 500,
	appIcon: nativeImage.createFromPath(path.join(__dirname, '/assets/icons/png/256x256.png')),
	trayIcon: nativeImage.createFromPath(path.join(__dirname, '/assets/icons/png/32x32.png')),
};

export type Config = typeof config;
