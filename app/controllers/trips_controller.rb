class TripsController < ApplicationController
  before_action :set_trip, only: [:show, :edit, :update, :destroy]

  def index
    @available_years = Trip.pluck(:start_date).compact.map(&:year).uniq.sort.reverse
    @available_trip_types = Trip.pluck(:trip_type).uniq.sort
    @trips = Trip.all
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
  end

  def show
    # @tripに紐づくLegを行程(segment)ごとにグループ化し、出発時刻順で並べる
    @legs_by_segment = @trip.legs.order(:departure_time).group_by(&:segment)
  end

  def new
    @trip = Trip.new
  end

  def create
    @trip = Trip.new(trip_params)
    if @trip.save
      redirect_to trips_path, notice: "新しい旅行を登録しました。"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @trip.update(trip_params)
      redirect_to trips_path, notice: "旅行の情報を更新しました。"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @trip.destroy
    redirect_to trips_path, notice: "旅行の記録を削除しました。", status: :see_other
  end

  private

  def set_trip
    @trip = Trip.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :trip_type)
  end
end
