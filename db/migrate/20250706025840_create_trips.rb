class CreateTrips < ActiveRecord::Migration[7.2]
  def change
    create_table :trips do |t|
      t.string :title, null: false  # null: false は必須項目という意味
      t.date :start_date
      t.date :end_date
      t.string :trip_type

      t.timestamps
    end
  end
end