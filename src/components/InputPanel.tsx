import type { DragEvent, KeyboardEvent } from "react";
import { useState } from "react";

interface InputPanelProps {
	value: string;
	onChange: (value: string) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	const insertTextAtCursor = (textarea: HTMLTextAreaElement, text: string) => {
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const newValue = `${value.substring(0, start)}${text}${value.substring(end)}`;
		onChange(newValue);

		// カーソル位置を調整
		setTimeout(() => {
			const newCursorPos = start + text.length;
			textarea.setSelectionRange(newCursorPos, newCursorPos);
		}, 0);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter((file) => file.type.startsWith("image/"));

		if (imageFiles.length === 0) {
			return;
		}

		const textarea = e.currentTarget.querySelector("textarea");
		if (!textarea) return;

		imageFiles.forEach((file, index) => {
			// PNG ファイルのみ処理
			if (!file.type.includes("png")) {
				return;
			}

			// Blob URLを使用（Base64より軽量で短い）
			const imageUrl = URL.createObjectURL(file);
			const fileName = file.name.replace(/\.[^/.]+$/, ""); // 拡張子を除去
			const markdown = `![${fileName}](${imageUrl})`;

			if (index === 0) {
				// 最初の画像はカーソル位置に挿入
				insertTextAtCursor(textarea, markdown);
			} else {
				// 複数の画像は末尾に追加
				const currentValue = textarea.value;
				onChange(`${currentValue}\n${markdown}`);
			}
		});
	};

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
		<div
			className={`input-panel border-r border-gray-300 dark:border-gray-700 h-full relative ${
				isDragOver ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400" : ""
			}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			role="application"
			aria-label="マークダウン入力エリア - 画像をドラッグ&ドロップできます"
		>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="マークダウンを入力してください..."
				className="markdown-textarea w-full h-full p-4 font-mono text-sm resize-none border-none outline-none bg-transparent focus:ring-0"
				spellCheck={false}
			/>
			{isDragOver && (
				<div className="absolute inset-0 flex items-center justify-center bg-blue-50/80 dark:bg-blue-900/40 border-2 border-dashed border-blue-400 pointer-events-none">
					<div className="text-blue-600 dark:text-blue-300 text-lg font-medium">
						画像をドロップしてください
					</div>
				</div>
			)}
		</div>
	);
}
