# プロジェクト構造

## ルートディレクトリ

```
├── src/                 # ソースコード
├── public/              # Viteが配信する静的アセット
├── node_modules/        # 依存関係（生成される）
├── .kiro/               # Kiro AIアシスタント設定
├── .vscode/             # VS Codeワークスペース設定
└── .git/                # Gitリポジトリデータ
```

## ソースコード構成（`src/`）

```
src/
├── main.tsx            # アプリケーションエントリーポイント
├── App.tsx             # メインAppコンポーネント
├── App.css             # App固有のスタイル
├── index.css           # グローバルスタイル
├── vite-env.d.ts       # Vite型定義
└── assets/             # 静的アセット（画像、アイコン）
    └── react.svg
```

## 設定ファイル

- `package.json` - 依存関係とスクリプト
- `vite.config.ts` - Vite ビルド設定
- `tsconfig.json` - TypeScript プロジェクト参照
- `tsconfig.app.json` - アプリ固有の TypeScript 設定
- `tsconfig.node.json` - Node.js 用 TypeScript 設定
- `biome.jsonc` - コードフォーマットとリントルール
- `lefthook.yml` - Git フック設定

## 規約

- React コンポーネントには`.tsx`拡張子を使用
- ユーティリティファイルには`.ts`拡張子を使用
- コンポーネント固有のスタイルはコンポーネントと同じ場所に配置
- グローバルスタイルは`src/index.css`に保持
- 静的アセットはルートレベルアクセス用に`public/`、バンドル用に`src/assets/`に配置
- 全ソースコードでタブインデントを使用（Biome で強制）
- インポートの整理は Biome が自動で処理
