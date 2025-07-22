class Api::V1::BaseController < ActionController::API
  include ActionController::MimeResponds
  
  before_action :authenticate_user!
  
  respond_to :json
  
  private
  
  def authenticate_user!
    unless request.headers['Authorization'].present?
      head :unauthorized
      return
    end

    begin
      token = request.headers['Authorization'].split(' ').last
      secret_key = Rails.application.credentials.dig(:devise, :jwt_secret_key) || Rails.application.secret_key_base
      jwt_payload = JWT.decode(token, secret_key).first
      @current_user_id = jwt_payload['user_id']
      
      # ユーザーが実際に存在するかも確認
      unless User.exists?(@current_user_id)
        head :unauthorized
        return
      end
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError => e
      Rails.logger.error "JWT認証エラー: #{e.message}"
      head :unauthorized
      return
    end
  end
  
  def current_user
    @current_user ||= User.find(@current_user_id) if @current_user_id
  end
  
  def render_error(resource)
    render json: {
      errors: resource.errors.full_messages
    }, status: :unprocessable_entity
  end
end