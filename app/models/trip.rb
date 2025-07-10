class Trip < ApplicationRecord
  has_many :legs, dependent: :destroy
  has_many :spots, through: :legs, source: :destination_spot
end
