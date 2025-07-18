class LegSerializer
  include JSONAPI::Serializer
  
  attributes :id, :departure_time, :arrival_time, :segment, :created_at, :updated_at
  
  belongs_to :trip
  belongs_to :transportation
  belongs_to :origin_spot, serializer: :spot
  belongs_to :destination_spot, serializer: :spot
end