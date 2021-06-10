import { formatDistanceToNow } from 'date-fns';
import { clipboard, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { CogIcon } from './ui/CogIcon';
import { CopyIcon } from './ui/CopyIcon';
import { CrossIcon } from './ui/CrossIcon';
import { SearchIcon } from './ui/SearchIcon';
import { TrashIcon } from './ui/TrashIcon';

export const App = () => {
	const history = useClipboardHistory();
	const [searchinput, setSearchInput] = useState('');
	const [filteredHistory, setFilteredHistory] = useState(history);

	useEffect(() => {
		if (!searchinput) return setFilteredHistory(history);

		const filtered = history.filter((clip) =>
			clip.text.toLowerCase().includes(searchinput.toLowerCase())
		);
		return setFilteredHistory(filtered);
	}, [searchinput, history]);

	useEffect(() => {
		console.log(history);
	}, [history]);

	const copyHandler = (text: string) => {
		clipboard.writeText(text);
		toast.dismiss();
		toast('📋 Copied to clipboard', {
			duration: 1500,
			position: 'bottom-center',
			className:
				'bg-gradient-to-t from-gray-800 to-gray-600 text-gray-100 shadow-md p-1 font-mono text-xs',
		});
	};

	const clearHandler = () => {
		ipcRenderer.send('clear');
		clipboard.writeText('');

		toast.dismiss();
		toast('📋 Cleared history', {
			duration: 1500,
			position: 'bottom-center',
			className:
				'bg-gradient-to-t from-gray-800 to-gray-600 text-gray-100 shadow-md p-1 font-mono text-xs',
		});
	};

	return (
		<main className='flex flex-col w-screen h-screen max-h-screen overflow-hidden border-2 border-green-500 dark:bg-gray-800'>
			<div className='p-1 font-mono font-semibold text-center text-green-400 bg-gray-500'>
				📋 ClipTale 📋
			</div>
			<div className='flex items-center justify-between px-4 pt-4'>
				<div className='flex items-center space-x-0.5 relative'>
					<input
						type='text'
						className='w-40 transition-width ring-1 ring-green-500 focus:ring-2 focus:ring-green-500 rounded-md py-0.5 px-6 focus:outline-none focus:w-56'
						value={searchinput}
						onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
							setSearchInput(e.target.value);
						}}
					/>
					<SearchIcon className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-600 left-1' />
					<CrossIcon
						onClick={() => setSearchInput('')}
						className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-600 cursor-pointer right-1 hover:text-red-500'
					/>
				</div>
				<div className='flex items-center space-x-1'>
					<button
						onClick={clearHandler}
						className='rounded-md focus:outline-none ring-red-500 focus:ring-1'
					>
						<TrashIcon className='w-4 h-4 text-gray-600 hover:text-red-500' />
					</button>
					<button className='rounded-md focus:outline-none ring-green-500 focus:ring-1'>
						<CogIcon className='w-4 h-4 text-gray-600 hover:text-green-500' />
					</button>
				</div>
			</div>
			<div className='p-4 space-y-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500'>
				{filteredHistory.map((clip) => (
					<div
						key={clip.id}
						className='relative w-full p-1 border border-gray-400 rounded-md shadow-md bg-gradient-to-t from-gray-300 hover:to-gray-200 to-gray-100 '
					>
						<button
							onClick={() => copyHandler(clip.text)}
							className='ring-green-500 focus:ring-1 absolute p-0.5 focus:outline-none hover:to-gray-200 border border-gray-500 rounded-md top-2 right-2 bg-gradient-to-t from-gray-400 to-gray-100'
						>
							<CopyIcon className='w-4 h-4 text-gray-600' />
						</button>
						<pre className='p-2 text-sm'>{clip.text.trim()}</pre>
						<div className='font-mono text-xs text-right text-gray-600'>
							{formatDistanceToNow(new Date(clip.createdAt)) + ' ago'}
						</div>
					</div>
				))}
			</div>
			<Toaster />
		</main>
	);
};
