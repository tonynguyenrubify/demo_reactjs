class Api::BooksController < ApiController

  def create   
    @book = Book.new(params[:book])
    if @book.save
      render :json => Book.all
    else
      render :json => {errors: "Failed"}
    end
  end
  
  def update
    @book = Book.find_by_id(params[:id])
    if @book.present?
      @book.attributes = params[:book]
      if @book.save
        render :json => Book.all
      else
        render :json => {errors: "Failed"}
      end
    else
      render :json => {errors: "Failed"}
    end    
  end
  
  def destroy
  end
  
  def index
    render json: Book.all
  end
end