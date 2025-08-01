import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewPanelProps {
	markdownText: string;
}

export function PreviewPanel({ markdownText }: PreviewPanelProps) {
	return (
		<div className="preview-panel overflow-auto h-full bg-background">
			<div className="max-w-none text-left p-4">
				{markdownText ? (
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							h1: ({ children }) => (
								<h1 className="text-3xl font-bold mb-4 text-foreground">
									{children}
								</h1>
							),
							h2: ({ children }) => (
								<h2 className="text-2xl font-semibold mb-3 text-foreground">
									{children}
								</h2>
							),
							h3: ({ children }) => (
								<h3 className="text-xl font-medium mb-2 text-foreground">
									{children}
								</h3>
							),
							p: ({ children }) => (
								<p className="mb-4 text-foreground leading-relaxed">
									{children}
								</p>
							),
							ul: ({ children, className }) => {
								const isTaskList = className?.includes("contains-task-list");
								return (
									<ul
										className={`mb-4 space-y-1 ${
											isTaskList ? "list-none" : "list-disc list-outside ml-6"
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
										<li className="text-foreground flex items-start gap-2">
											{children}
										</li>
									);
								}
								return <li className="text-foreground">{children}</li>;
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
									<code className="block bg-muted p-4 rounded-lg text-sm font-mono text-foreground overflow-x-auto">
										{children}
									</code>
								);
							},
							pre: ({ children }) => (
								<pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
									{children}
								</pre>
							),
							blockquote: ({ children }) => (
								<blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground mb-4">
									{children}
								</blockquote>
							),
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
					<div className="text-muted-foreground italic text-left text-sm">
						プレビューがここに表示されます
					</div>
				)}
			</div>
		</div>
	);
}
