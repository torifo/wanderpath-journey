class TripSerializer
  include JSONAPI::Serializer
  
  attributes :id, :title, :start_date, :end_date, :trip_type, :created_at, :updated_at
  
  belongs_to :user
  has_many :legs
end