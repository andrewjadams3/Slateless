get '/board/:id' do
  if find_board(params[:id])
    current_user
    erb :'board/index'
  else
    redirect '/'
  end
end

post '/board' do
  board = new_board
  current_user.boards << board if current_user
  redirect "/board/#{board.url}"
end