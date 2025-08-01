# 設計文書

## 概要

マークダウンプレビュー機能は、既存の React アプリケーションを分割ビューのマークダウンエディターに変換します。左側にマークダウン入力用のテキストエリア、右側にリアルタイム HTML プレビューを表示し、ユーザーの入力に応じて即座に更新されます。

## アーキテクチャ

### 技術スタック

- **React 19.1.0** - UI フレームワーク
- **TypeScript** - 型安全性
- **TailwindCSS** - スタイリング
- **react-markdown** - マークダウンパーサーとレンダラー
- **Vite** - 開発サーバーとビルドツール

### コンポーネント構成

```
App
├── MarkdownEditor (新規)
    ├── InputPanel (新規)
    │   └── textarea要素
    └── PreviewPanel (新規)
        └── ReactMarkdown コンポーネント
```

## コンポーネントとインターフェース

### App コンポーネント

- **責任**: アプリケーションのルートコンポーネント
- **変更**: 既存のカウンター UI を削除し、MarkdownEditor コンポーネントを配置
- **スタイル**: 全画面レイアウトの設定

### MarkdownEditor コンポーネント

- **責任**: マークダウンエディターの全体的な状態管理とレイアウト
- **状態**:
  - `markdownText: string` - 現在のマークダウンテキスト
- **Props**: なし
- **レイアウト**: CSS Grid または Flexbox を使用した分割ビュー

### InputPanel コンポーネント

- **責任**: マークダウンテキストの入力受付
- **Props**:
  - `value: string` - 現在のマークダウンテキスト
  - `onChange: (value: string) => void` - テキスト変更時のコールバック
- **機能**:
  - リサイズ可能なテキストエリア
  - 適切なフォントファミリー（monospace）
  - 行番号表示（オプション）

### PreviewPanel コンポーネント

- **責任**: マークダウンの HTML レンダリング表示
- **Props**:
  - `markdownText: string` - レンダリングするマークダウンテキスト
- **機能**:
  - react-markdown を使用した HTML レンダリング
  - スクロール同期（オプション）
  - 適切なマークダウンスタイリング

## データモデル

### マークダウンテキスト状態

```typescript
interface MarkdownEditorState {
  markdownText: string;
}
```

### コンポーネント Props 型定義

```typescript
interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
}

interface PreviewPanelProps {
  markdownText: string;
}
```

## エラーハンドリング

### マークダウンパース エラー

- **戦略**: react-markdown は内部的にエラーを処理し、無効な構文でも部分的にレンダリング
- **実装**: エラーバウンダリーコンポーネントで PreviewPanel をラップ
- **フォールバック**: パースエラー時は元のテキストを表示

### パフォーマンス最適化

- **デバウンス**: 高速入力時のレンダリング頻度制限（300ms）
- **メモ化**: React.memo を使用して PreviewPanel の不要な再レンダリングを防止
- **遅延ローディング**: 大きなドキュメント用の仮想スクロール（将来的な拡張）

## テスト戦略

### 単体テスト

- **InputPanel**: テキスト入力と onChange コールバックのテスト
- **PreviewPanel**: マークダウンレンダリングの正確性テスト
- **MarkdownEditor**: 状態管理とコンポーネント間の連携テスト

### 統合テスト

- **エンドツーエンド**: ユーザーの入力からプレビュー更新までの完全なフロー
- **レスポンシブ**: 異なる画面サイズでのレイアウト動作

### テストケース例

```typescript
// InputPanelのテスト例
test("should call onChange when text is entered", () => {
  const mockOnChange = jest.fn();
  render(<InputPanel value="" onChange={mockOnChange} />);

  const textarea = screen.getByRole("textbox");
  fireEvent.change(textarea, { target: { value: "# Hello" } });

  expect(mockOnChange).toHaveBeenCalledWith("# Hello");
});

// PreviewPanelのテスト例
test("should render markdown as HTML", () => {
  render(<PreviewPanel markdownText="# Hello World" />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Hello World"
  );
});
```

## スタイリング設計

### レイアウト

- **分割ビュー**: CSS Grid を使用した 50/50 の分割
- **レスポンシブ**: モバイルでは縦積みレイアウト
- **リサイズ**: CSS resize プロパティでパネルサイズ調整可能

### テーマ

- **カラーパレット**: TailwindCSS のデフォルトカラー使用
- **タイポグラフィ**:
  - 入力エリア: `font-mono`
  - プレビューエリア: `font-sans`
- **ダークモード**: TailwindCSS のダークモード機能を活用

### CSS クラス設計

```css
/* 主要レイアウトクラス */
.markdown-editor {
  @apply grid grid-cols-1 md:grid-cols-2 h-screen;
}

.input-panel {
  @apply border-r border-gray-300 dark:border-gray-700;
}

.preview-panel {
  @apply overflow-auto p-4;
}

.markdown-textarea {
  @apply w-full h-full p-4 font-mono text-sm resize-none border-none outline-none;
}
```

## セキュリティ考慮事項

### XSS 防止

- **react-markdown**: デフォルトで HTML タグをサニタイズ
- **設定**: `allowDangerousHtml`オプションは無効のまま
- **リンク**: 外部リンクには`rel="noopener noreferrer"`を自動付与

### 入力検証

- **文字数制限**: 大きなドキュメントによるメモリ使用量制限
- **ファイルアップロード**: 現バージョンでは対応しない（将来的な拡張）

## パフォーマンス最適化

### レンダリング最適化

```typescript
// デバウンスフック例
const useDebouncedValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### メモリ管理

- **状態の最小化**: 必要最小限の状態のみ保持
- **イベントリスナー**: 適切なクリーンアップ
- **大きなドキュメント**: 仮想化による部分レンダリング（将来的な拡張）

## 依存関係

### 新規追加が必要な依存関係

```json
{
  "dependencies": {
    "react-markdown": "^9.0.1"
  },
  "devDependencies": {
    "@types/react-markdown": "^8.0.7"
  }
}
```

### 既存依存関係の活用

- **TailwindCSS**: スタイリング
- **TypeScript**: 型安全性
- **React**: コンポーネントベース UI
- **Vite**: 開発環境とビルド
