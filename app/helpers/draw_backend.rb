require 'faye/websocket'
require 'json'
Faye::WebSocket.load_adapter('thin')

class DrawBackend
  KEEPALIVE_TIME = 15 # in seconds

  def initialize(app)
    @app     = app
    @clients = Hash.new { |hash, key| hash[key] = [] }
  end

  def call(env)
    if Faye::WebSocket.websocket?(env)
      ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })
      ws.on :open do |event|
        p [:open, ws.object_id]
        unless @clients[ws.url].empty?
          @clients[ws.url][0].send(JSON.generate({type: "request"}))
        end
        @clients[ws.url] << ws
      end

      ws.on :message do |event|
        # p [:message, event.data]
        @clients[ws.url].each do |client| 
          client.send(event.data) if client != ws
        end
      end

      ws.on :close do |event|
        p [:close, ws.object_id, event.code, event.reason]
        @clients[ws.url].delete(ws)
        @clients.delete(ws.url) if @clients[ws.url].empty?
        ws = nil
      end

      # Return async Rack response
      ws.rack_response

    else
      @app.call(env)
    end
  end
end