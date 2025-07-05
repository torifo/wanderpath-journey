# プロジェクト「wanderpath-journey」開発ドキュメント

このドキュメントは、Ruby on RailsとPostGISで構築された旅の記録アプリケーション「wanderpath-journey」の開発手順、設定、アーキテクチャをまとめたものです。

## 1. プロジェクト概要
目的: 旅行の記録を、位置情報（地図）と連携させて記録・表示するブログサイト。

アーキテクチャ: モノリシック (Monolithic)

フレームワーク: Ruby on Rails

データベース: PostgreSQL + PostGIS拡張

## 2. 開発環境の起動と停止
このプロジェクトはDockerで環境を構築しています。

### サーバーの起動
```bash
# プロジェクトルートで実行
docker compose up -d
```
Webアプリケーションは `http://localhost:3000` で表示されます。

データベースには `localhost:54320` で接続できます。

### サーバーの停止
```bash
docker compose down
```

## 3. ディレクトリ構造と主要ファイル
```
.
├── docker/
│   └── Dockerfile      # Railsアプリケーション用コンテナの設計図
├── Gemfile             # 使用するgem(ライブラリ)を定義
└── docker-compose.yml  # Docker全体の設計図
```

## 4. バックエンド (Ruby on Rails) 詳細
### 4.1. Docker設定
#### docker-compose.yml:
`web` (Rails), `db` (PostGIS) の2つのコンテナを定義する設計図です。

ポートフォワーディング:
- `3000:3000` (web): PCの3000番ポートをRailsコンテナの3000番に接続。
- `54320:5432` (db): PCの54320番ポートをPostGISコンテナの5432番に接続。

#### docker/Dockerfile:
Railsコンテナの設計図。Ruby本体や、git、postgresql-devなど、gemのインストールやDB接続に必要なライブラリをインストールします。

### 4.2. データベース (PostgreSQL / PostGIS)
#### 接続情報 (config/database.yml):
RailsからPostGISコンテナへの接続情報を定義します。この後、Docker環境に合わせて設定を修正する必要があります。

`host`にはdocker-compose.ymlで定義したサービス名である`db`を指定します。

#### テーブル設計 (db/migrate/):
データベースのテーブル構造は、マイグレーションファイルに定義されます。

#### データベースの作成とマイグレーション:
- データベースの作成: `docker compose exec web rails db:create`
- マイグレーションの実行: `docker compose exec web rails db:migrate`
