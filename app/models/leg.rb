class Leg < ApplicationRecord
  belongs_to :trip
  belongs_to :transportation
end
