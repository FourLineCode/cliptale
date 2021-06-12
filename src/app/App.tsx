import { formatDistanceToNow } from 'date-fns';
import { clipboard, ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { CogIcon } from './ui/CogIcon';
import { CopyIcon } from './ui/CopyIcon';
import { CrossIcon } from './ui/CrossIcon';
import { SearchIcon } from './ui/SearchIcon';
import { Tooltip } from './ui/Tooltip';
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
				'bg-gradient-to-t from-gray-400 to-gray-300 font-semibold text-gray-800 shadow-lg p-1 font-mono text-xs',
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
				'bg-gradient-to-t from-gray-400 to-gray-300 font-semibold text-red-500 shadow-lg p-1 font-mono text-xs',
		});
	};

	const settingsHandler = () => {
		toast.dismiss();
		toast('📋 Coming soon', {
			duration: 1500,
			position: 'bottom-center',
			className:
				'bg-gradient-to-t from-gray-400 to-gray-300 font-semibold text-gray-800 shadow-lg p-1 font-mono text-xs',
		});
	};

	const deleteHandler = (clipId: number) => {
		ipcRenderer.send('delete', clipId);

		toast.dismiss();
		toast('📋 Deleted successfully', {
			duration: 1500,
			position: 'bottom-center',
			className:
				'bg-gradient-to-t from-gray-400 text-red-500 font-semibold to-gray-300 shadow-lg p-1 font-mono text-xs',
		});
	};

	return (
		<main className='flex flex-col w-screen h-screen max-h-screen overflow-hidden dark:bg-gray-800'>
			<div className='p-1 font-mono font-semibold text-center bg-gray-600 shadow-lg text-brand-400'>
				📋 ClipTale 📋
			</div>

			<div className='flex items-center justify-between px-4 pt-4'>
				<div className='flex items-center space-x-0.5 relative'>
					<input
						type='text'
						placeholder='Search...'
						className='w-40 transition-width ring-1 ring-brand-500 focus:ring-2 focus:ring-brand-500 rounded-md py-0.5 px-6 focus:outline-none focus:w-56'
						value={searchinput}
						onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
							setSearchInput(e.target.value);
						}}
					/>
					<SearchIcon className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-600 left-1' />
					<Tooltip text='Clear search'>
						<CrossIcon
							onClick={() => setSearchInput('')}
							className='absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-600 cursor-pointer right-1 hover:text-red-500'
						/>
					</Tooltip>
				</div>
				<div className='flex items-center space-x-1'>
					<div className='font-serif'>
						{filteredHistory.length}{' '}
						<span className='text-xs text-gray-600'> items | </span>
					</div>
					<Tooltip text='Clear'>
						<button
							onClick={clearHandler}
							className='rounded-md focus:outline-none ring-red-500 focus:ring-1'
						>
							<TrashIcon className='w-4 h-4 text-gray-600 hover:text-red-500' />
						</button>
					</Tooltip>
					<Tooltip text='Settings'>
						<button
							onClick={settingsHandler}
							className='rounded-md focus:outline-none ring-brand-500 focus:ring-1'
						>
							<CogIcon className='w-4 h-4 text-gray-600 hover:text-brand-500' />
						</button>
					</Tooltip>
				</div>
			</div>

			<div className='p-4 space-y-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500'>
				{filteredHistory.map((clip) => (
					<div
						key={clip.id}
						className='relative w-full p-1 border border-gray-400 rounded-md shadow-md bg-gradient-to-t from-gray-300 hover:to-gray-200 to-gray-100 '
					>
						<Tooltip text='Delete'>
							<button
								onClick={() => deleteHandler(clip.id)}
								className='ring-red-500 focus:ring-1 absolute p-0.5 focus:outline-none hover:to-red-200 border border-gray-500 rounded-md top-1 right-1 bg-gradient-to-t from-gray-400 to-gray-100'
							>
								<CrossIcon className='w-4 h-4 text-red-600' />
							</button>
						</Tooltip>
						<Tooltip text='Copy'>
							<button
								onClick={() => copyHandler(clip.text)}
								className='ring-brand-500 focus:ring-1 absolute p-0.5 focus:outline-none hover:to-gray-200 border border-gray-500 rounded-md top-1 right-7 bg-gradient-to-t from-gray-400 to-gray-100'
							>
								<CopyIcon className='w-4 h-4 text-gray-600 hover:text-brand-500' />
							</button>
						</Tooltip>
						<pre className='py-2 pl-2 pr-12 text-sm break-words'>
							{clip.text.trim()}
						</pre>
						<div className='flex justify-between px-2 font-mono text-xs text-gray-600'>
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
