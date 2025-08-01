import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { InputPanel } from "./InputPanel";
import { PreviewPanel } from "./PreviewPanel";

export function MarkdownEditor() {
	const [markdownText, setMarkdownText] = useState<string>("");
	const debouncedMarkdownText = useDebounce(markdownText, 300);

	const handleTextChange = (value: string) => {
		setMarkdownText(value);
	};

	return (
		<div className="markdown-editor h-screen grid grid-cols-1 md:grid-cols-2">
			{/* Input Panel - 左側 */}
			<InputPanel value={markdownText} onChange={handleTextChange} />

			{/* Preview Panel - 右側 */}
			<PreviewPanel markdownText={debouncedMarkdownText} />
		</div>
	);
}
