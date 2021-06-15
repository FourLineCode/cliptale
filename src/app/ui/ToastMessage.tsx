import React from 'react';
import { ClipboardIcon } from './ClipboardIcon';

interface Props {
	text: string;
}

export const ToastMessage = ({ text }: Props) => (
	<span className='flex items-center space-x-1'>
		<ClipboardIcon className='w-5 h-5' />
		<span>{text}</span>
	</span>
);
