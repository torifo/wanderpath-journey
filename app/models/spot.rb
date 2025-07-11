class Spot < ApplicationRecord
  has_many :origin_legs, class_name: 'Leg', foreign_key: 'origin_spot_id', dependent: :destroy
  has_many :destination_legs, class_name: 'Leg', foreign_key: 'destination_spot_id', dependent: :destroy

  # 出発地として使われている旅行
  has_many :trips_as_origin, through: :origin_legs, source: :trip
  # 目的地として使われている旅行
  has_many :trips_as_destination, through: :destination_legs, source: :trip

  # 出発地・目的地を問わず、このスポットが含まれるすべての旅行を重複なく返すメソッド
  def trips
    (trips_as_origin + trips_as_destination).uniq
  end

end
