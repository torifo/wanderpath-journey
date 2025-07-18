class SpotSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :description, :prefecture, :spot_type, :created_at, :updated_at
  
  attribute :coordinates do |spot|
    if spot.location
      {
        lat: spot.location.lat,
        lon: spot.location.lon
      }
    end
  end
end