# 技術スタック

## コア技術

- **React 19.1.0** - 最新機能を備えた UI フレームワーク
- **TypeScript 5.8.3** - 型安全な JavaScript 開発
- **Vite 7.0.4** - SWC を使用した React コンパイルによる高速ビルドツールと開発サーバー

## パッケージマネージャー

- **Bun** - 必須のパッケージマネージャー（preinstall スクリプトで強制）

## コード品質とフォーマット

- **Biome 2.1.3** - 高速なフォーマッターとリンター（ESLint/Prettier の代替）
  - タブインデントを強制
  - JavaScript の文字列にはダブルクォート
  - React とテスト用の推奨ルールを有効化
  - 保存時にインポートを自動整理
- **Lefthook** - 自動コード品質チェック用の Git フック

## よく使うコマンド

### 開発

```bash
bun dev          # 開発サーバーを起動
bun build        # 本番用ビルド（TypeScript + Vite）
bun preview      # 本番ビルドをプレビュー
```

### コード品質

```bash
bun format       # Biomeでコードをフォーマット
bun lint         # Biomeでコードをリント
bun lint:fix     # リント問題を自動修正
bun check        # フォーマット + リント + 自動修正を一括実行
```

### セットアップ

```bash
bun install      # 依存関係をインストール
bun prepare      # Gitフックをインストール（自動実行）
```

## Git フック

- **Pre-commit**: ステージされたファイルを自動的にフォーマットとリント
- **Pre-push**: プッシュされる全ファイルを検証
