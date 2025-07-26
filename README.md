# Wanderpath Journey

This document outlines the development procedures, settings, and architecture for Wanderpath Journey, a travel logging application built with Ruby on Rails and a React frontend.

## 1. Project Overview
**Objective:** A blog site for recording and displaying travel logs in conjunction with location information (maps).

**Architecture:** Monolithic Rails backend with a separate React frontend.

**Backend:**
- Framework: Ruby on Rails 7.2
- Database: PostgreSQL + PostGIS extension
- Ruby Version: 3.3

**Frontend:**
- Framework: React (Vite)
- UI: Tailwind CSS

## 2. Getting Started
This project is containerized using Docker.

### Launching the Development Environment
```bash
# Run from the project root
docker compose up
```
- **Web Application (Frontend):** `http://localhost:5173`
- **API Server (Backend):** `http://localhost:3000`
- **Database:** Connect using a DB client at `localhost:54320`

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

## 4. Backend (Ruby on Rails) Details
### 4.1. Docker Configuration
- **`docker-compose.yml`**: Defines the `web` (Rails), `db` (PostGIS), and `frontend` (React) services.
- **`Dockerfile`**: Builds the Rails container based on Alpine Linux, installing Ruby and necessary libraries.

### 4.2. Database (PostgreSQL / PostGIS)
- **Connection:** Database connection details are managed via environment variables, as defined in `config/database.yml`.
- **Schema:** The database schema is managed through Rails migrations located in `db/migrate/`.

### 4.3. Database Commands
- **Create Database:** `docker compose run --rm web rails db:create` (run once)
- **Run Migrations:** `docker compose run --rm web rails db:migrate`
- **Rollback Migration:** `docker compose run --rm web rails db:rollback`

## 5. Production Deployment
The application is deployed to a VPS using Docker Compose with a production configuration.

- **Frontend:** `https://<your-frontend-domain>`
- **API:** `https://<your-api-domain>`

Sensitive information such as domain names, database credentials, and secret keys are managed via environment variables and are not hard-coded in the repository.