import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { clipboard, ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ToastOptions } from 'react-hot-toast/dist/core/types';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { CogIcon } from './ui/CogIcon';
import { CopyIcon } from './ui/CopyIcon';
import { CrossIcon } from './ui/CrossIcon';
import { SearchIcon } from './ui/SearchIcon';
import { ToastMessage } from './ui/ToastMessage';
import { Tooltip } from './ui/Tooltip';
import { TrashIcon } from './ui/TrashIcon';

export const App = () => {
	const history = useClipboardHistory();
	const [searchinput, setSearchInput] = useState('');
	const [filteredHistory, setFilteredHistory] = useState(history);
	const [selected, setSelected] = useState(0);
	const elementRef = useRef<Record<number, HTMLDivElement>>({});
	const searchBarRef = useRef<HTMLInputElement>(null);
	const toastProps = (classes: string): Partial<ToastOptions> => ({
		duration: 2000,
		position: 'bottom-center',
		className: clsx(
			classes,
			'bg-gray-800 border border-gray-600 font-semibold shadow-lg p-1 font-mono text-xs'
		),
	});

	useEffect(() => {
		if (!searchinput) return setFilteredHistory(history);

		const filtered = history.filter((clip) =>
			clip.text.toLowerCase().includes(searchinput.toLowerCase())
		);
		return setFilteredHistory(filtered);
	}, [searchinput, history]);

	const copyHandler = (text: string) => {
		clipboard.writeText(text);

		toast.dismiss();
		toast(<ToastMessage text='Copied to clipboard' />, toastProps('text-gray-300'));
	};

	const clearHandler = () => {
		ipcRenderer.send('clear');
		clipboard.writeText('');

		toast.dismiss();
		toast(<ToastMessage text='Cleared history' />, toastProps('text-red-500'));
	};

	const deleteHandler = (clipId: number) => {
		ipcRenderer.send('delete', clipId);

		toast.dismiss();
		toast(<ToastMessage text='Deleted successfully' />, toastProps('text-red-500'));
	};

	const settingsHandler = () => {
		toast.dismiss();
		toast(<ToastMessage text='Coming soon' />, toastProps('text-brand-400'));
	};

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			enum ValidKeys {
				ArrowUp = 'ArrowUp',
				ArrowDown = 'ArrowDown',
				Control = 'Control',
				C = 'c',
				K = 'k',
				Enter = 'Enter',
				Backspace = 'Backspace',
				Delete = 'Delete',
				Alt = 'Alt',
				Escape = 'Escape',
			}

			const isValidKey = (key: string) => {
				const isKey = (Object as any).values(ValidKeys).includes(key);
				const isDigit = !isNaN(parseInt(event.key));
				return isKey || isDigit;
			};

			if (isValidKey(event.key)) {
				const key = event.key;
				if (key === ValidKeys.Escape) {
					setSelected(0);
					if (searchBarRef.current === document.activeElement) {
						searchBarRef.current?.blur();
					}
				} else if (key === ValidKeys.ArrowUp) {
					setSelected((pre) => Math.max(1, pre - 1));
				} else if (key === ValidKeys.ArrowDown) {
					setSelected((pre) => Math.min(filteredHistory.length, pre + 1));
				} else if (key === ValidKeys.Enter || (key === ValidKeys.C && event.ctrlKey)) {
					if (selected === 0) return;

					copyHandler(filteredHistory[selected - 1].text);
					setSelected(0);
				} else if (key === ValidKeys.Delete || key === ValidKeys.Backspace) {
					if (selected === 0) return;

					deleteHandler(filteredHistory[selected - 1].id);
					setSelected(0);
				} else if (!isNaN(parseInt(key)) && event.altKey) {
					const index = parseInt(key);

					if (index > 0 && index <= filteredHistory.length) {
						setSelected(index);
					} else {
						setSelected(0);
					}
				} else if (key === ValidKeys.K && event.ctrlKey) {
					if (searchBarRef.current) {
						searchBarRef.current.focus();
					}
				}
			}
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [filteredHistory, selected]);

	useEffect(() => {
		if (selected) {
			elementRef.current[selected].scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'center',
			});
		}
	}, [selected]);

	return (
		<main className='flex flex-col w-screen h-screen max-h-screen overflow-hidden'>
			<div className='p-1 font-mono font-semibold text-center bg-gray-800 shadow-lg text-brand-400'>
				ClipTale
			</div>

			<div className='flex items-center justify-between px-4 pt-4 pb-2'>
				<div className='flex items-center space-x-0.5 relative'>
					<input
						ref={searchBarRef}
						type='text'
						placeholder='Search...'
						className='w-40 bg-gray-700 focus:bg-gray-600 text-gray-100 transition-width ring-1 ring-brand-500 focus:ring-2 focus:ring-brand-500 rounded-md py-0.5 px-7 focus:outline-none focus:w-56'
						value={searchinput}
						onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
							setSearchInput(e.target.value);
						}}
					/>
					<SearchIcon className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-100 left-1' />
					<Tooltip text='Clear search'>
						<CrossIcon
							onClick={() => setSearchInput('')}
							className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-100 cursor-pointer right-1 hover:text-red-500'
						/>
					</Tooltip>
				</div>
				<div className='flex items-center space-x-1'>
					<div className='items-center font-serif text-white'>
						<span>{filteredHistory.length} </span>
						<span className='text-xs text-gray-100'> items</span>
						<span> | </span>
					</div>
					<Tooltip text='Clear'>
						<button
							onClick={clearHandler}
							className='rounded-md focus:outline-none ring-red-500 focus:ring-1'
						>
							<TrashIcon className='w-4 h-4 text-gray-100 hover:text-red-500' />
						</button>
					</Tooltip>
					<Tooltip text='Settings'>
						<button
							onClick={settingsHandler}
							className='rounded-md focus:outline-none ring-brand-500 focus:ring-1'
						>
							<CogIcon className='w-4 h-4 text-gray-100 hover:text-brand-500' />
						</button>
					</Tooltip>
				</div>
			</div>

			<div className='p-4 space-y-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 hover:scrollbar-thumb-gray-400'>
				{filteredHistory.map((clip, idx) => (
					<div
						key={clip.id}
						className={clsx(
							selected === idx + 1 && 'ring-2 ring-brand-500',
							'relative w-full p-1 border border-gray-600 rounded-md shadow-lg text-gray-100 bg-gray-800 bg-opacity-50 hover:bg-opacity-75'
						)}
						ref={(el) => {
							if (el) elementRef.current[idx + 1] = el;
						}}
					>
						<Tooltip text='Copy'>
							<button
								onClick={() => copyHandler(clip.text)}
								className='ring-brand-500 focus:ring-1 text-gray-300 hover:text-brand-500 absolute p-0.5 focus:outline-none border border-gray-600 rounded-md top-1 right-7 bg-gray-700 hover:bg-gray-800'
							>
								<CopyIcon className='w-4 h-4' />
							</button>
						</Tooltip>
						<Tooltip text='Delete'>
							<button
								onClick={() => deleteHandler(clip.id)}
								className='ring-red-500 focus:ring-1 absolute p-0.5 focus:outline-none border border-gray-600 rounded-md top-1 right-1 bg-gray-700 hover:bg-gray-800'
							>
								<CrossIcon className='w-4 h-4 text-red-500' />
							</button>
						</Tooltip>
						<pre className='py-2 pl-2 pr-12 text-sm break-words'>
							{clip.text.trim()}
						</pre>
						<div className='flex justify-between px-2 font-mono text-xs text-gray-400'>
							<span>Length: {clip.text.length}</span>
							<span>{formatDistanceToNow(new Date(clip.createdAt)) + ' ago'}</span>
						</div>
					</div>
				))}
			</div>

			<Toaster />
		</main>
	);
};
