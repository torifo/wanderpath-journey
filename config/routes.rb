Rails.application.routes.draw do
  # API Routes
  namespace :api do
    namespace :v1 do
      # Devise JWT Authentication
      devise_for :users, controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations'
      }
      
      # API Resources
      resources :trips do
        get :map_data, on: :member
        resources :legs, only: [:index, :create, :update, :destroy]
      end
      
      resources :spots, except: [:show]
      resources :users, only: [:show, :update]
    end
  end

  # Web Routes (existing)
  devise_for :users
  get "trips/index"
  get "trips/new"
  # 現在のトップページを/homeに設定
  get "/home", to: "trips#index"
  
  # ルートURLをログインページに設定（非ログイン時）
  # ログイン済みの場合は/homeにリダイレクト
  devise_scope :user do
    authenticated :user do
      root to: "trips#index", as: :authenticated_root
    end
    unauthenticated :user do
      root to: "devise/sessions#new", as: :unauthenticated_root
    end
  end

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
