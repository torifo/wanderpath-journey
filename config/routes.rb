Rails.application.routes.draw do
  get "trips/index"
  get "trips/new"
  # Defines the root path route ("/")
  # ルートURL ("/") にアクセスしたら、TripsControllerのindexアクションを呼び出す
  root "trips#index"

  # Tripリソースの基本的なルーティングをまとめて定義
  # これにより /trips, /trips/new, /trips/:id などが利用可能になる
  resources :trips

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
end
