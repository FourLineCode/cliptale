import { BrowserWindow, Menu, screen, Tray } from 'electron';
import { config } from '../internal/config';
import { Clipboard } from './clipboard';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
export declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

export class MainWindow {
	private mainWindow: BrowserWindow;
	private tray: Tray;
	private positions: { x: number; y: number };
	private clipboard: Clipboard;

	public constructor() {
		this.positions = {
			x: 0,
			y: 0,
		};
	}

	public static init = () => {
		return new MainWindow();
	};

	public createWindow = () => {
		this.getWindowPositions();

		this.mainWindow = new BrowserWindow({
			x: this.positions.x,
			y: this.positions.y,
			show: config.window.initialShow,
			height: config.window.height,
			width: config.window.width,
			resizable: config.window.resizable,
			center: config.window.center,
			frame: config.window.frame,
			fullscreenable: config.window.fullscreenable,
			movable: config.window.movable,
			roundedCorners: config.window.rounded,
			icon: config.appIcon,
			autoHideMenuBar: config.window.hideMenu,
			webPreferences: {
				devTools: config.dev,
				nodeIntegration: true,
				contextIsolation: false,
			},
		});

		this.createTrayIcon();

		this.addWindowEventListeners();

		this.startClipboardListener();

		this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

		if (config.openDevtoolsOnInitial) {
			this.mainWindow.webContents.openDevTools();
		}
	};

	private addWindowEventListeners = () => {
		this.mainWindow.on('show', this.setWindowPositions);
	};

	private createTrayIcon = () => {
		this.tray = new Tray(config.trayIcon);

		const trayContextMenu = Menu.buildFromTemplate([
			{
				label: 'Open/Close Cliptale',
				click: () => {
					if (!this.mainWindow.isVisible()) {
						this.mainWindow.show();
					} else {
						this.mainWindow.hide();
					}
				},
			},
			{
				label: 'Reload ClipTale',
				role: 'forceReload',
			},
			{
				type: 'separator',
			},
			{
				label: 'Toggle Devtools',
				click: () => {
					this.mainWindow.webContents.toggleDevTools();
				},
				visible: config.dev,
			},
			{
				label: 'Quit Cliptale',
				role: 'quit',
			},
		]);

		this.tray.setContextMenu(trayContextMenu);
	};

	private getWindowPositions = () => {
		const { width } = screen.getPrimaryDisplay().bounds;

		this.positions.x = width;
		this.positions.y = 0;
	};

	private setWindowPositions = () => {
		this.mainWindow.setPosition(this.positions.x, this.positions.y);
	};

	private startClipboardListener = () => {
		this.clipboard = Clipboard.init();

		this.clipboard.listen();
	};
}
