class AddSegmentToLegs < ActiveRecord::Migration[7.2]
  def change
    add_column :legs, :segment, :string
    add_index :legs, :segment
  end
end
