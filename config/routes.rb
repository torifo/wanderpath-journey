Rails.application.routes.draw do
  get "trips/index"
  get "trips/new"
  # Defines the root path route ("/")
  # ルートURL ("/") にアクセスしたら、TripsControllerのindexアクションを呼び出す
  root "trips#index"

  # Tripリソース
  resources :trips do
    get :map_data, on: :member
    # 旅行(Trip)に紐づく、移動区間(Leg)のリソース
    resources :legs, only: [:new, :create, :edit, :update, :destroy]
  end

  # スポット(Spot)は独立したマスターデータとして管理する
  resources :spots, except: [:show]

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
