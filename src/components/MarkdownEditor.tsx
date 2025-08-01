import { useState } from "react";
import { InputPanel } from "./InputPanel";
import { PreviewPanel } from "./PreviewPanel";

export function MarkdownEditor() {
	const [markdownText, setMarkdownText] = useState<string>("");

	const handleTextChange = (value: string) => {
		setMarkdownText(value);
	};

	return (
		<div className="markdown-editor h-full grid grid-cols-1 md:grid-cols-2">
			{/* Input Panel - 左側 */}
			<InputPanel value={markdownText} onChange={handleTextChange} />

			{/* Preview Panel - 右側 */}
			<PreviewPanel markdownText={markdownText} />
		</div>
	);
}
