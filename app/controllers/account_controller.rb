get '/account' do
  if current_user
    erb :'account/index'
  else
    flash[:notice] = "Please sign in."
    redirect '/account/signin'
  end
end

get '/account/signin' do
  if current_user
    flash[:notice] = 'You are already signed in! <a href="/account/signout">Click here to sign out.</a>'
    redirect '/'
  else
    erb :'account/signin'
  end
end

get '/account/signout' do
  session.clear
  redirect '/'
end

get '/account/signup' do
  if current_user
    flash[:notice] = 'You are already signed in! <a href="/account/signout">Click here to sign out.</a>'
    redirect '/'
  else
    erb :'account/signup'
  end
end

post '/account/signin' do
  data = params[:data]
  user = User.find_by(email: data[:email]).try(:authenticate, data[:password])
  if user
    session[:current_user] = user.id
    redirect '/account'
  else
    @error = "Sign in unsuccessful"
    @email = data[:email]
    erb :'account/signin'
  end
end

post '/account/signup' do
  data = params[:data]
  user = User.new(data)
  if user.save
    session[:current_user] = user.id
    redirect '/account'
  else
    @errors = user.errors.full_messages
    @email = data[:email]
    erb :'account/signup'
  end
end