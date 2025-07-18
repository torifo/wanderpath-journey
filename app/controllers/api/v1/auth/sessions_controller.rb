class Api::V1::Auth::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'ログインしました。', data: { user: UserSerializer.new(resource).serializable_hash[:data][:attributes] } }
      }, status: :ok
    else
      render json: {
        status: { message: "ユーザーが見つかりませんでした。" }
      }, status: :unauthorized
    end
  end

  def respond_to_on_destroy
    if request.headers['Authorization'].present?
      jwt_payload = JWT.decode(request.headers['Authorization'].split(' ').last, Rails.application.secret_key_base).first
      current_user = User.find(jwt_payload['sub'])
    end
    
    if current_user
      render json: {
        status: 200,
        message: "ログアウトしました。"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "アクティブなセッションが見つかりませんでした。"
      }, status: :unauthorized
    end
  end
end