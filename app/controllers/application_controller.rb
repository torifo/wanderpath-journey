class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  
  # すべてのアクションでログインを必須とする（開発者専用アプリとして）
  before_action :authenticate_user!
  
  # Deviseのstrong parametersを設定
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  # セッション管理の正常化
  before_action :clear_session_if_needed
  
  private
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username])
  end
  
  def clear_session_if_needed
    # ログアウト後やbuild後にセッションをクリア
    if params[:clear_session] == 'true' || session[:should_clear]
      reset_session
      session.delete(:should_clear)
    end
  end
  
  # ログアウト後のリダイレクト先を設定
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end
end
