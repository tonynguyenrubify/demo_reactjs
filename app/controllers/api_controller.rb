class ApiController < ActionController::Base
  layout false  
  # before_filter :require_login_user
  # before_filter :authenticate_user!
  # def require_login_user
  #   puts params.inspect
  #   if params[:api_authen_token].blank? == false
  #     @current_user = User.find_by_authentication_token(params[:api_authen_token])
  #   elsif request.headers['single-access-token'].blank? == false
  #     @current_user = User.find_by_authentication_token(request.headers['single-access-token'])
  #   end
  #   
  #   if @current_user.nil?
  #     redirect_to :status => 404
  #   end
  # end
  # 
  # def current_user
  #   @current_user
  # end
  
end