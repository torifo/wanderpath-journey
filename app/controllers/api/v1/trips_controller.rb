class Api::V1::TripsController < Api::V1::BaseController
  before_action :set_trip, only: [:show, :update, :destroy, :map_data]

  # GET /api/v1/trips
  def index
    user_trips = current_user.trips
    @available_years = user_trips.pluck(:start_date).compact.map(&:year).uniq.sort.reverse
    @available_trip_types = user_trips.pluck(:trip_type).uniq.sort
    @trips = user_trips

    if params[:trip_type].present?
      @trips = @trips.where(trip_type: params[:trip_type])
    end
    if params[:year].present?
      @trips = @trips.where("extract(year from start_date) = ?", params[:year])
    end
    if params[:month].present?
      @trips = @trips.where("extract(month from start_date) = ?", params[:month])
    end
    @trips = @trips.order(start_date: :desc)

    render json: {
      trips: TripSerializer.new(@trips).serializable_hash[:data],
      filters: {
        available_years: @available_years,
        available_trip_types: @available_trip_types
      }
    }
  end

  # GET /api/v1/trips/:id
  def show
    legs_by_segment = @trip.legs.includes(:origin_spot, :destination_spot, :transportation).order(:departure_time).group_by(&:segment)
    all_spots = @trip.spots.uniq
    destination_spots = all_spots.filter { |spot| spot.spot_type == 'destination' && spot.name != '自宅' }
    waypoint_spots = all_spots.filter { |spot| spot.spot_type == 'waypoint' && spot.name != '自宅' }

    render json: {
      trip: TripSerializer.new(@trip).serializable_hash[:data][:attributes],
      legs_by_segment: legs_by_segment.transform_values { |legs| LegSerializer.new(legs).serializable_hash[:data] },
      destination_spots: SpotSerializer.new(destination_spots).serializable_hash[:data],
      waypoint_spots: SpotSerializer.new(waypoint_spots).serializable_hash[:data]
    }
  end

  # POST /api/v1/trips
  def create
    @trip = current_user.trips.build(trip_params)
    
    if @trip.save
      render json: {
        trip: TripSerializer.new(@trip).serializable_hash[:data][:attributes],
        message: "新しい旅行を登録しました。"
      }, status: :created
    else
      render_error(@trip)
    end
  end

  # PATCH/PUT /api/v1/trips/:id
  def update
    if @trip.update(trip_params)
      render json: {
        trip: TripSerializer.new(@trip).serializable_hash[:data][:attributes],
        message: "旅行の情報を更新しました。"
      }
    else
      render_error(@trip)
    end
  end

  # DELETE /api/v1/trips/:id
  def destroy
    @trip.destroy
    render json: { message: "旅行の記録を削除しました。" }
  end

  # GET /api/v1/trips/:id/map_data
  def map_data
    spots = @trip.legs.flat_map { |leg| [leg.origin_spot, leg.destination_spot] }.uniq

    spot_features = spots.map do |spot|
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [spot.location.lon, spot.location.lat]
        },
        properties: {
          name: spot.name,
          spot_type: spot.spot_type
        }
      }
    end

    line_coordinates = spots.map { |spot| [spot.location.lon, spot.location.lat] }
    line_feature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: line_coordinates
      }
    }

    render json: {
      type: 'FeatureCollection',
      features: spot_features + [line_feature]
    }
  end

  private

  def set_trip
    @trip = current_user.trips.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :trip_type)
  end
end