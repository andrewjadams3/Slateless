get '/account' do
  if current_user
    erb :'account/index'
  else
    redirect '/account/signin'
  end
end

get '/account/signin' do
  erb :'account/signin'
end

get '/account/signout' do
  session.clear
  redirect '/'
end

get '/account/signup' do
  erb :'account/signup'
end

post '/account/signin' do
  data = params[:data]
  user = User.find_by(email: data[:email]).try(:authenticate, data[:password])
  if user
    session[:current_user] = user.id
    redirect '/account'
  else
    @error = "Login unsuccessful"
    @email = data[:email]
    erb :'account/signin'
  end
end

post '/account/signup' do
  data = params[:data]
  user = User.new(data)
  if user.valid?
    user.save
    session[:current_user] = user.id
    redirect '/account'
  else
    @errors = user.errors.full_messages
    @name = data[:name]
    @email = data[:email]
    erb :'account/signup'
  end
end