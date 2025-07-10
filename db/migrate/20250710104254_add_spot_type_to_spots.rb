class AddSpotTypeToSpots < ActiveRecord::Migration[7.2]
  def change
    add_column :spots, :spot_type, :string, default: 'destination', null: false
  end
end
