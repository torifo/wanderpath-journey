class CreateLegs < ActiveRecord::Migration[7.2]
  def change
    create_table :legs do |t|
      t.datetime :departure_time
      t.datetime :arrival_time

      # どの旅行に属するか
      t.references :trip, null: false, foreign_key: true
      # どの移動手段を使ったか
      t.references :transportation, null: false, foreign_key: true

      # --- 出発地と目的地をSpotテーブルに紐付ける ---
      # 'origin_spot'という名前で、spotsテーブルを参照する外部キーを作成
      t.references :origin_spot, null: false, foreign_key: { to_table: :spots }
      # 'destination_spot'という名前で、spotsテーブルを参照する外部キーを作成
      t.references :destination_spot, null: false, foreign_key: { to_table: :spots }

      t.timestamps
    end
  end
end
