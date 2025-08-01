interface InputPanelProps {
	value: string;
	onChange: (value: string) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
	return (
		<div className="input-panel border-r border-gray-300 dark:border-gray-700 h-full">
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="マークダウンを入力してください..."
				className="markdown-textarea w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-transparent focus:ring-0"
				spellCheck={false}
			/>
		</div>
	);
}
