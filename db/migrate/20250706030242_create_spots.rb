class CreateSpots < ActiveRecord::Migration[7.2]
  def change
    # このマイグレーションを実行する前に、PostGIS拡張機能を有効にする
    enable_extension 'postgis'

    create_table :spots do |t|
      t.string :name, null: false
      t.text :description
      t.string :prefecture

      # PostGISのpoint型を使って、緯度経度の位置情報を保存するカラム
      t.st_point :location, geographic: true
      
      t.timestamps
    end

    # 位置情報を使った検索を高速化するための空間インデックス
    add_index :spots, :location, using: :gist
  end
end
