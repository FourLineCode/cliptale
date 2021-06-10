import Tippy from '@tippyjs/react';
import React from 'react';

interface Props {
	text?: string;
	children: React.ReactElement;
}

export const Tooltip = ({ text, children }: Props) => {
	return (
		<Tippy
			content={text}
			delay={0}
			duration={0}
			className='p-1 font-mono text-xs text-white bg-gray-600 rounded-md'
			animation='scale-subtle'
		>
			{children}
		</Tippy>
	);
};
