# さらに軽量で安全なAlpine Linuxベースのイメージを使用
# Rubyのバージョンを最新の安定版に更新して脆弱性を最小限に抑える
FROM ruby:3.3-alpine

# Alpine Linuxのパッケージマネージャー(apk)を使い、必要なライブラリをインストール
# - git: Railsのインストーラーが内部で使用するため追加
RUN apk add --update --no-cache build-base postgresql-dev nodejs yarn yaml-dev git && apk upgrade --no-cache

# 作業ディレクトリを作成・設定
WORKDIR /app

# GemfileとGemfile.lockをコンテナにコピー
COPY Gemfile Gemfile.lock ./

# gemをインストール
RUN bundle install

# アプリケーションのコード全体をコピー
COPY . .

# コンテナの3000番ポートを開放
EXPOSE 3000

# コンテナ起動時に実行されるデフォルトのコマンド
CMD ["bundle", "exec", "rails", "s", "-p", "3000", "-b", "0.0.0.0"]
