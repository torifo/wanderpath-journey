class CreatePosts < ActiveRecord::Migration[7.2]
  def change
    create_table :posts do |t|
      t.string :title, null: false # null: false を追加して必須項目に
      t.text :body
      t.string :embed_url
      t.references :spot, null: false, foreign_key: true

      t.timestamps
    end
  end
end
