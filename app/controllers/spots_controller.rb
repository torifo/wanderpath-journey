class SpotsController < ApplicationController
    before_action :set_spot, only: [:edit, :update, :destroy]

    # GET /spots
    def index
        @spots = Spot.all.order(:name)
    end

    # GET /spots/new
    def new
        @spot = Spot.new
    end

    # POST /spots
    def create
        @spot = Spot.new(spot_params)
        
        factory = RGeo::Geographic.spherical_factory(srid: 4326)
        lon = params[:spot][:lon].to_f
        lat = params[:spot][:lat].to_f
        @spot.location = factory.point(lon, lat)

        if @spot.save
        redirect_to spots_path, notice: "新しいスポットを作成しました。"
        else
        render :new, status: :unprocessable_entity
        end
    end

    # GET /spots/:id/edit
    def edit
        # before_actionで@spotがセットされるので空でOK
    end

    # PATCH/PUT /spots/:id
    def update
        # まず、位置情報以外のパラメータで更新
        if @spot.update(spot_params)
        # 次に、緯度経度が入力されていれば、位置情報も更新
        if params[:spot][:lat].present? && params[:spot][:lon].present?
            factory = RGeo::Geographic.spherical_factory(srid: 4326)
            lon = params[:spot][:lon].to_f
            lat = params[:spot][:lat].to_f
            @spot.update(location: factory.point(lon, lat))
        end
        redirect_to spots_path, notice: "スポットの情報を更新しました。"
        else
        render :edit, status: :unprocessable_entity
        end
    end

    # DELETE /spots/:id
    def destroy
        @spot.destroy
        redirect_to spots_path, notice: "スポットを削除しました。", status: :see_other
    end

    private

    def set_spot
        @spot = Spot.find(params[:id])
    end

    # lonとlatも受け取れるように修正
    def spot_params
        params.require(:spot).permit(:name, :description, :prefecture, :spot_type)
    end
end
