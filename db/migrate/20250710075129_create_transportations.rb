class CreateTransportations < ActiveRecord::Migration[7.2]
  def change
    create_table :transportations do |t|
      t.string :category, null: false # 必須項目にする
      t.string :name, null: false     # 必須項目にする

      t.timestamps
    end
  end
end
