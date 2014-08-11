get '/board/fetch' do
  @board = find_board(params[:first].upcase + "-" + params[:second].upcase)
  redirect('/') unless request.xhr?
  if @board
    status 200
    content_type :json
    {url: @board.url}.to_json
  else
    status 401
    content_type :json
    {error: "Board not found"}.to_json
  end
end

get '/board/:id' do
  @board = find_board(params[:id].upcase)
  if @board
    current_user
    erb :'board/index'
  else
    flash[:alert] = "Uh-oh! We can't find that board."
    redirect '/'
  end
end

post '/board' do
  board = new_board(params[:title])
  current_user.boards << board if current_user
  content_type :json
  {url: board.url}.to_json
end