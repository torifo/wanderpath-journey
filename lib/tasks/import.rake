require 'csv'

namespace :import do
  desc "Import trips from a CSV file, grouping by name to determine start/end dates."
  task trips: :environment do
    csv_file_path = Rails.root.join('lib', 'data', 'trips_data.csv')

    unless File.exist?(csv_file_path)
      puts "CSVファイルが見つかりません: #{csv_file_path}"
      next
    end

    puts "CSVファイルからのデータ投入を開始します..."

    # データを一時的に保存するためのハッシュ
    trips_by_name = {}

    # CSVを読み込み、group_nameごとに日付をまとめる
    CSV.foreach(csv_file_path, headers: true) do |row|
      group_name = row['group_name']
      date = Date.parse(row['date'])

      # group_nameが存在しなければ新しい配列を作成
      trips_by_name[group_name] ||= []
      # 日付を追加
      trips_by_name[group_name] << date
    end

    puts "CSVデータの読み込みが完了しました。データベースへの登録を開始します..."

    # 既存のTripデータを一度すべて削除
    Trip.destroy_all
    puts "既存のTripデータを削除しました。"

    # まとめたデータを使ってTripレコードを作成
    trips_by_name.each do |title, dates|
      start_date = dates.min
      end_date = dates.max
      duration = (end_date - start_date).to_i + 1

      # 期間に応じてタイプを自動で判定
      trip_type = case duration
                  when 1
                    '日帰り'
                  when 2..4
                    '短期旅行'
                  else
                    '長期旅行'
                  end

      Trip.create!(
        title: title,
        start_date: start_date,
        end_date: end_date,
        trip_type: trip_type
      )
      puts "「#{title}」を登録しました。(#{duration}日間)"
    end

    puts "データ投入が完了しました！ (#{Trip.count}件の旅行を登録)"
  end
end
