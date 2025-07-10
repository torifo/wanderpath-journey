class Spot < ApplicationRecord
  has_many :origin_legs, class_name: 'Leg', foreign_key: 'origin_spot_id', dependent: :destroy
  has_many :destination_legs, class_name: 'Leg', foreign_key: 'destination_spot_id', dependent: :destroy
end
