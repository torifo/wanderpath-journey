# config/initializers/cors.rb

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Environment-specific frontend origins
    if Rails.env.development?
      origins 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'
    elsif Rails.env.production?
      # Production frontend origins
      origins 'https://wanderpath-journey.megu.riumu.net', 'http://wanderpath-journey.megu.riumu.net'
    else
      origins '*' # Test environment
    end

    # API routes
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      allow_headers: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With']
      
    # Legacy routes (for backward compatibility)
    resource '/trips*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      allow_headers: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With']
  end
end
