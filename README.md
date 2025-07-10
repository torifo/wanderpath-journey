# プロジェクト「wanderpath-journey」開発ドキュメント

このドキュメントは、Ruby on RailsとPostGISで構築された旅の記録アプリケーション「wanderpath-journey」の開発手順、設定、アーキテクチャをまとめたものです。

## 1. プロジェクト概要
目的: 旅行の記録を、位置情報（地図）と連携させて記録・表示するブログサイト。

アーキテクチャ: モノリシック (Monolithic)

フレームワーク: Ruby on Rails 7.2

データベース: PostgreSQL + PostGIS拡張

Rubyバージョン: 3.3

## 2. 開発環境の起動と停止
このプロジェクトはDockerで環境を構築しています。

### サーバーの起動
```bash
# プロジェクトルートで実行
docker compose up
```
Webアプリケーションは `http://localhost:3000` で表示されます。

データベースには、DBクライアントなどから `localhost:54320` で接続できます。

### サーバーの停止
`docker compose up` を実行しているターミナルで `Ctrl + C` を押します。

コンテナを完全に削除する場合は `docker compose down` を実行します。

## 3. ディレクトリ構造と主要ファイル
```
.
├── Gemfile             # 使用するgem(ライブラリ)を定義
├── README.md           # このドキュメント
├── app/                # アプリケーションの主要なコード (MVC)
│   ├── controllers/    # リクエストを処理するコントローラー
│   ├── models/         # データベースと連携するモデル
│   └── views/          # ユーザーに表示されるビュー(HTML)
├── config/             # アプリケーションの設定ファイル
│   ├── database.yml    # データベース接続設定
│   └── routes.rb       # URLのルーティング設定
├── db/                 # データベース関連のファイル
│   └── migrate/        # テーブル設計図(マイグレーションファイル)
├── docker/
│   └── Dockerfile      # Railsアプリケーション用コンテナの設計図
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
Railsコンテナの設計図。Ruby本体や、git、postgresql-dev、yaml-devなど、gemのインストールやDB接続に必要なライブラリをインストールします。Alpine Linuxをベースにしています。

### 4.2. データベース (PostgreSQL / PostGIS)
#### 接続情報 (config/database.yml):
Docker環境の環境変数を読み込むように設定済みです。

`host`にはdocker-compose.ymlで定義したサービス名である`db`が自動的に設定されます。

#### テーブル設計 (db/migrate/):
データベースのテーブル構造は、マイグレーションファイルに定義されます。カラムの追加や変更は、新しいマイグレーションファイルを作成して行います。

#### データベース関連のコマンド:
- データベースの作成: `docker compose run --rm web rails db:create` (初回のみ)
- マイグレーションの実行: `docker compose run --rm web rails db:migrate`
- マイグレーションの取り消し: `docker compose run --rm web rails db:rollback`

# ローカルデータベースダンプ
\copy ( SELECT DISTINCT g.group_name, l.date FROM yarikuri_list l JOIN group_list g ON l.group_id = g.id ORDER BY g.group_name, l.date ) TO './trips_datas.csv' WITH CSV HEADER;
## パス
C:\Users\Swimm\develop\Web_Page\Megurium\wanderpath-journey\lib\data