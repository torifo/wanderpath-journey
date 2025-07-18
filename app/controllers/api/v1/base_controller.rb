class Api::V1::BaseController < ActionController::API
  include ActionController::MimeResponds
  
  before_action :authenticate_user!
  
  respond_to :json
  
  private
  
  def authenticate_user!
    if request.headers['Authorization'].present?
      authenticate_or_request_with_http_token do |token|
        jwt_payload = JWT.decode(token, Rails.application.secret_key_base).first
        @current_user_id = jwt_payload['user_id']
      rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
        head :unauthorized
      end
    else
      head :unauthorized
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