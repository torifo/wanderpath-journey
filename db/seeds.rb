# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Tripテーブルにデータが1件も存在しない場合のみ、以下の処理を実行する
if Trip.count.zero?
  puts "テストデータの作成を開始します..."

  trips_data = [
    { title: "夏の沖縄旅行", start_date: "2025-08-10", end_date: "2025-08-15", trip_type: "長期旅行" },
    { title: "京都紅葉狩り", start_date: "2025-11-22", end_date: "2025-11-24", trip_type: "短期旅行" },
    { title: "箱根温泉ぷらっと旅", start_date: "2025-02-01", end_date: "2025-02-01", trip_type: "ぷらっと" },
    { title: "鎌倉あじさい散策", start_date: "2024-06-15", end_date: "2024-06-15", trip_type: "日帰り" },
    { title: "冬の北海道スキー旅行", start_date: "2024-01-20", end_date: "2024-01-25", trip_type: "長期旅行" },
    { title: "金沢グルメ旅", start_date: "2024-09-14", end_date: "2024-09-16", trip_type: "短期旅行" }
  ]

  trips_data.each do |data|
    Trip.create!(data)
  end

  puts "テストデータの作成が完了しました！"
else
  puts "すでにデータが存在するため、テストデータの作成をスキップしました。"
end
