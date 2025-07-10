class Leg < ApplicationRecord
  belongs_to :trip
  belongs_to :transportation
  belongs_to :origin_spot, class_name: 'Spot'
  belongs_to :destination_spot, class_name: 'Spot'
end
