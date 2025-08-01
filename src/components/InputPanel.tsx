import type { KeyboardEvent } from "react";

interface InputPanelProps {
	value: string;
	onChange: (value: string) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();

			const textarea = e.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			// 現在の行を取得
			const lines = value.split("\n");
			const currentLineIndex = value.substring(0, start).split("\n").length - 1;
			const currentLine = lines[currentLineIndex];

			// リスト項目かどうかをチェック
			const listItemRegex = /^(\s*)([-*+]|\d+\.)\s/;
			const match = currentLine.match(listItemRegex);

			if (e.shiftKey) {
				// Shift+Tab でアンインデント
				if (match && match[1].length >= 2) {
					// リスト項目でインデントがある場合
					const indent = match[1];
					const marker = match[2];
					const newIndent = indent.substring(2); // 2スペース削除

					const newLine = currentLine.replace(
						listItemRegex,
						`${newIndent}${marker} `,
					);
					const newLines = [...lines];
					newLines[currentLineIndex] = newLine;

					const newValue = newLines.join("\n");
					onChange(newValue);

					setTimeout(() => {
						const newCursorPos = start - 2;
						textarea.setSelectionRange(newCursorPos, newCursorPos);
					}, 0);
				} else if (currentLine.startsWith("  ")) {
					// 通常の行で2スペース以上のインデントがある場合
					const newLine = currentLine.substring(2);
					const newLines = [...lines];
					newLines[currentLineIndex] = newLine;

					const newValue = newLines.join("\n");
					onChange(newValue);

					setTimeout(() => {
						const newCursorPos = start - 2;
						textarea.setSelectionRange(newCursorPos, newCursorPos);
					}, 0);
				}
			} else if (match) {
				// リスト項目の場合、インデントを追加
				const indent = match[1];
				const marker = match[2];
				const newIndent = `${indent}  `; // 2スペースでインデント

				const newLine = currentLine.replace(
					listItemRegex,
					`${newIndent}${marker} `,
				);
				const newLines = [...lines];
				newLines[currentLineIndex] = newLine;

				const newValue = newLines.join("\n");
				onChange(newValue);

				// カーソル位置を調整
				setTimeout(() => {
					const newCursorPos = start + 2;
					textarea.setSelectionRange(newCursorPos, newCursorPos);
				}, 0);
			} else {
				// 通常のタブ処理（2スペース挿入）
				const newValue = `${value.substring(0, start)}  ${value.substring(end)}`;
				onChange(newValue);

				setTimeout(() => {
					textarea.setSelectionRange(start + 2, start + 2);
				}, 0);
			}
		}
	};

	return (
		<div className="input-panel border-r border-gray-300 dark:border-gray-700 h-full">
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="マークダウンを入力してください..."
				className="markdown-textarea w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-transparent focus:ring-0"
				spellCheck={false}
			/>
		</div>
	);
}
