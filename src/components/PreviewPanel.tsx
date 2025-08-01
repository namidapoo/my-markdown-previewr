import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface PreviewPanelProps {
	markdownText: string;
}

export function PreviewPanel({ markdownText }: PreviewPanelProps) {
	// Blob URLを含む画像を抽出
	const extractBlobUrls = (text: string) => {
		const imageRegex = /!\[([^\]]*)\]\((blob:[^)]+)\)/g;
		const blobUrls = new Map<string, string>();

		// matchAllを使用してより安全に処理
		const matches = text.matchAll(imageRegex);
		for (const matchResult of matches) {
			const [_fullMatch, alt, blobUrl] = matchResult;
			blobUrls.set(alt, blobUrl);
		}

		return blobUrls;
	};

	const blobUrls = extractBlobUrls(markdownText);

	return (
		<div className="h-full bg-white dark:bg-gray-900 overflow-auto">
			<div className="max-w-none text-left p-6 min-h-full">
				{markdownText ? (
					<ReactMarkdown
						remarkPlugins={[remarkGfm, remarkBreaks]}
						components={{
							h1: ({ children }) => (
								<h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
									{children}
								</h1>
							),
							h2: ({ children }) => (
								<h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
									{children}
								</h2>
							),
							h3: ({ children }) => (
								<h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">
									{children}
								</h3>
							),
							p: ({ children }) => (
								<p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
									{children}
								</p>
							),
							br: () => <br />,
							ul: ({ children, className }) => {
								const isTaskList = className?.includes("contains-task-list");
								return (
									<ul
										className={`mb-4 space-y-1 ${
											isTaskList
												? "list-disc list-outside ml-6"
												: "list-disc list-outside ml-6"
										}`}
									>
										{children}
									</ul>
								);
							},
							ol: ({ children }) => (
								<ol className="list-decimal list-outside ml-6 mb-4 space-y-1">
									{children}
								</ol>
							),
							li: ({ children, className }) => {
								const isTaskItem = className?.includes("task-list-item");
								if (isTaskItem) {
									return (
										<li className="text-foreground flex items-start gap-2 list-none">
											{children}
										</li>
									);
								}
								// リスト項目内の段落のマージンを調整
								return (
									<li className="text-foreground [&>p]:mb-0 [&>p]:leading-normal">
										{children}
									</li>
								);
							},
							input: ({ type, checked, disabled }) => {
								if (type === "checkbox") {
									return (
										<input
											type="checkbox"
											checked={checked}
											disabled={disabled}
											className="mr-2 mt-1 flex-shrink-0"
											readOnly
										/>
									);
								}
								return null;
							},
							code: ({ children, className }) => {
								const isInline = !className;
								if (isInline) {
									return (
										<code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
											{children}
										</code>
									);
								}
								return (
									<code className="text-sm font-mono text-foreground">
										{children}
									</code>
								);
							},
							pre: ({ children }) => (
								<pre
									className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto"
									style={{ whiteSpace: "pre" }}
								>
									{children}
								</pre>
							),
							blockquote: ({ children }) => (
								<blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
									{children}
								</blockquote>
							),
							img: (props) => {
								const { src, alt } = props;

								// 抽出したBlob URLから正しいsrcを取得
								const actualSrc = blobUrls.get(alt || "") || src;

								// src が空文字列の場合は何も表示しない
								if (!actualSrc || actualSrc.trim() === "") {
									return null;
								}

								return (
									<img
										src={actualSrc}
										alt={alt || ""}
										className="max-w-full h-auto mb-4 rounded border"
										onError={(e) => {
											// 画像読み込みエラー時の処理
											const target = e.target as HTMLImageElement;
											target.style.display = "none";
										}}
									/>
								);
							},
							a: ({ children, href }) => (
								<a
									href={href}
									className="text-primary hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{children}
								</a>
							),
							table: ({ children }) => (
								<div className="overflow-x-auto mb-4">
									<table className="min-w-full border-collapse border border-border">
										{children}
									</table>
								</div>
							),
							thead: ({ children }) => (
								<thead className="bg-muted">{children}</thead>
							),
							tbody: ({ children }) => <tbody>{children}</tbody>,
							tr: ({ children }) => (
								<tr className="border-b border-border">{children}</tr>
							),
							th: ({ children }) => (
								<th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
									{children}
								</th>
							),
							td: ({ children }) => (
								<td className="border border-border px-4 py-2 text-foreground">
									{children}
								</td>
							),
						}}
					>
						{markdownText}
					</ReactMarkdown>
				) : (
					<div className="flex items-center justify-center min-h-full">
						<p className="text-gray-400 dark:text-gray-500 text-sm">
							プレビューがここに表示されます
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
