import { formatDistanceToNow } from 'date-fns';
import { clipboard } from 'electron';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useClipboardHistory } from './hooks/useClipboardHistory';
import { CopyIcon } from './ui/CopyIcon';

export const App = () => {
	const history = useClipboardHistory();

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

	return (
		<main className='flex flex-col w-screen h-screen max-h-screen overflow-hidden border-2 border-green-500 dark:bg-gray-800'>
			<div className='p-1 font-mono font-semibold text-center text-white bg-gray-500'>
				📋 ClipTale 📋
			</div>
			<div className='p-4 space-y-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500'>
				{history.map((clip) => (
					<div
						key={clip.id}
						className='relative w-full p-1 border border-gray-400 rounded-md shadow-md bg-gradient-to-t from-gray-300 hover:to-gray-200 to-gray-100 '
					>
						<button
							onClick={() => copyHandler(clip.text)}
							className='absolute p-0.5 focus:outline-none hover:to-gray-200 border border-gray-500 rounded-md top-2 right-2 bg-gradient-to-t from-gray-400 to-gray-100'
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
