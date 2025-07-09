class TripsController < ApplicationController
  # before_actionに :show を追加
  before_action :set_trip, only: [:show, :edit, :update, :destroy]

  def index
    @trips = Trip.all.order(start_date: :desc)
  end

  # 詳細ページを表示するためのアクションを追加
  def show
    # before_actionで@tripがセットされるので、中身は空でOK
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
    # :id を :show にも使うように変更
    @trip = Trip.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :trip_type)
  end
end
