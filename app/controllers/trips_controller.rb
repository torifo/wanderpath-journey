class TripsController < ApplicationController
  def index
    @trips = Trip.all
  end

  # 新規作成フォームを表示するためのアクション
  def new
    @trip = Trip.new
  end

  # フォームから送信されたデータを受け取り、保存するためのアクション
  def create
    @trip = Trip.new(trip_params)

    if @trip.save
      # 保存が成功したら、一覧ページにリダイレクトする
      redirect_to trips_path, notice: "新しい旅行を登録しました。"
    else
      # 保存が失敗したら、もう一度フォームを表示する
      render :new, status: :unprocessable_entity
    end
  end

  private

  # Strong Parameters: セキュリティのため、許可したカラムのみを受け取る
  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :trip_type)
  end
end
