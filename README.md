> [!note]
> 本アプリケーションは、Kiroを使用して開発されたデモアプリケーションです。社内向けKiro紹介記事のために作成されました。

# マークダウンプレビューアプリ

<img width="3428" height="2324" alt="CleanShot 2025-08-01 at 22 39 19@2x" src="https://github.com/user-attachments/assets/2a58a02e-cd8d-4bff-b1bd-cc73cc6251ad" />

## 概要

リアルタイムでマークダウンをプレビューできるWebアプリケーションです。左側のエディタに入力したマークダウンテキストが、右側のプレビューエリアに即座に反映されます。

### 主な機能

- **リアルタイムプレビュー**: 入力と同時にマークダウンがHTMLに変換されて表示
- **コードブロック表示**: コードブロックのスタイリング対応
- **画像プレビュー**: 画像URLを入力すると即座にプレビュー表示
- **GitHub Flavored Markdown**: テーブル、タスクリストなどのGFM機能に対応

## 技術スタック

- **フレームワーク**: React 19 + TypeScript 5.8
- **ビルドツール**: Vite 7
- **スタイリング**: Tailwind CSS 4 (@tailwindcss/vite)
- **マークダウンパーサー**: react-markdown + remark-gfm + remark-breaks
- **フォーマッター/リンター**: Biome
- **Git hooks**: lefthook
- **パッケージマネージャー**: Bun

## セットアップ

### 必要な環境

- Node.js 18以上
- Bun（推奨）またはnpm/yarn

### インストール手順

```bash
# リポジトリのクローン
git clone <repository-url>
cd my-markdown-previewr

# 依存関係のインストール
bun install

# 開発サーバーの起動
bun dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:5173` にアクセスしてください。

### ビルド

本番環境向けのビルドを作成する場合：

```bash
bun run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

## 使い方

1. 左側のエディタエリアにマークダウンテキストを入力
2. 右側のプレビューエリアにリアルタイムで変換結果が表示されます
3. 以下の記法がサポートされています：
   - 見出し（# ## ### など）
   - リスト（箇条書き・番号付き）
   - コードブロック（```で囲む）
   - インラインコード（`で囲む）
   - リンク・画像
   - 太字・斜体
   - 引用
   - テーブル

## プロジェクト構成

```
my-markdown-previewr/
├── src/
│   ├── components/
│   │   ├── MarkdownEditor.tsx  # メインコンポーネント
│   │   ├── InputPanel.tsx      # 入力エリア
│   │   └── PreviewPanel.tsx    # プレビューエリア
│   ├── lib/
│   │   └── utils.ts            # ユーティリティ関数
│   └── main.tsx                # エントリーポイント
├── public/                     # 静的ファイル
└── package.json               # プロジェクト設定
```

