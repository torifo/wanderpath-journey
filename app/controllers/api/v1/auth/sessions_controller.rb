class Api::V1::Auth::SessionsController < Api::V1::BaseController
  skip_before_action :authenticate_user!, only: [:create, :signup]
  
  # POST /api/v1/auth/login
  def create
    user = User.find_by(email: params[:email])
    
    if user&.valid_password?(params[:password])
      token = generate_jwt(user)
      render json: {
        message: 'ログインしました',
        user: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token
      }, status: :ok
    else
      render json: {
        error: 'メールアドレスまたはパスワードが正しくありません'
      }, status: :unauthorized
    end
  end

  # POST /api/v1/auth/signup
  def signup
    user = User.new(user_params)
    
    if user.save
      token = generate_jwt(user)
      render json: {
        message: 'アカウントが作成されました',
        user: UserSerializer.new(user).serializable_hash[:data][:attributes],
        token: token
      }, status: :created
    else
      render json: {
        error: 'アカウントの作成に失敗しました',
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/auth/logout
  def destroy
    # JWTトークンはステートレスなので、クライアント側で削除
    render json: {
      message: 'ログアウトしました'
    }, status: :ok
  end

  # GET /api/v1/auth/me
  def me
    render json: {
      user: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    }, status: :ok
  end

  private

  def user_params
    params.permit(:email, :password, :password_confirmation)
  end

  def generate_jwt(user)
    JWT.encode(
      {
        user_id: user.id,
        exp: 24.hours.from_now.to_i
      },
      Rails.application.credentials.dig(:devise, :jwt_secret_key) || Rails.application.secret_key_base
    )
  end
end