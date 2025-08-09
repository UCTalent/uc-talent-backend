# Authentication Migration Guide

## Firebase Auth & Web3 Auth (Thirdweb) Implementation

### Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Dependencies](#dependencies)
4. [Environment Variables](#environment-variables)
5. [Firebase Auth Implementation](#firebase-auth-implementation)
6. [Web3 Auth (Thirdweb) Implementation](#web3-auth-thirdweb-implementation)
7. [Routes Configuration](#routes-configuration)
8. [Testing](#testing)
9. [Migration Steps](#migration-steps)

---

## Prerequisites

### Required Gems

```ruby
# Gemfile
gem 'firebase-admin-sdk'  # For Firebase Auth
gem 'jwt'                 # For JWT handling
gem 'doorkeeper'          # For OAuth 2.0
gem 'devise'              # For user authentication
gem 'trailblazer'         # For operations (optional)
```

### Install Dependencies

```bash
bundle install
```

---

## Database Setup

### 1. Add Firebase Fields to User Model

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_firebase_fields_to_users.rb
class AddFirebaseFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :firebase_uid, :string
    add_column :users, :firebase_provider, :string
    add_index :users, :firebase_uid, unique: true
  end
end
```

### 2. Add Web3 Fields to User Model

```ruby
# db/migrate/YYYYMMDDHHMMSS_add_thirdweb_fields_to_users.rb
class AddThirdwebFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :thirdweb_metadata, :jsonb, default: {}
    add_index :users, :thirdweb_metadata, using: :gin
  end
end
```

### 3. Update User Model

```ruby
# app/models/user.rb
class User < ApplicationRecord
  # Add these fields to your User model
  # firebase_uid: :string
  # firebase_provider: :string
  # thirdweb_metadata: :jsonb

  # Include Doorkeeper for OAuth
  has_many :access_grants,
           class_name: "Doorkeeper::AccessGrant",
           foreign_key: :resource_owner_id,
           dependent: :delete_all

  has_many :access_tokens,
           class_name: "Doorkeeper::AccessToken",
           foreign_key: :resource_owner_id,
           dependent: :delete_all

  # Devise configuration
  devise :doorkeeper, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable, :lockable, :timeoutable, :trackable

  # Add any additional associations you need
  # has_one :profile
  # has_many :posts
end
```

---

## Environment Variables

### Required Environment Variables

```bash
# Firebase Configuration
FIREBASE_SA_KEY=base64_encoded_service_account_key

# OAuth Configuration
OAUTH_APPLICATION_ID=your_oauth_app_id

# Thirdweb Configuration
JWKS_AUTHENTICATION_SVC_URL=https://your-auth-service.com/.well-known/jwks.json
UC_GATEWAY_API_KEY=your_gateway_api_key

# Optional: Thirdweb OAuth App (for seeds)
DOORKEEPER_REDIRECT_URI=your_redirect_uri
```

---

## Firebase Auth Implementation

### 1. Firebase Admin SDK Setup

```ruby
# lib/firebase_admin.rb
require 'firebase-admin-sdk'
require 'base64'

class FirebaseAdmin
  class << self
    def load_credential
      @credential ||= begin
        sa_key_json = Base64.decode64(ENV['FIREBASE_SA_KEY'])
        Firebase::Admin::Credentials.from_json(sa_key_json)
      end
    end

    def app
      @app ||= Firebase::Admin::App.new(credentials: load_credential)
    end

    def auth
      @auth ||= app.auth
    end
  end
end
```

### 2. Auth Controller

```ruby
# app/controllers/api/v1/auth_controller.rb
require 'net/http'
require 'uri'
require 'json'
require 'jwt'

module Api
  module V1
    class AuthController < ApplicationController
      MAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

      def firebase_auth
        token = params[:firebase_token]
        user_data = fetch_user_data_from_token(token)
        user = find_or_create_user(user_data)

        access_token = Doorkeeper::AccessToken.create!(
          application_id: ENV['OAUTH_APPLICATION_ID'],
          resource_owner_id: user.id,
          expires_in: Doorkeeper.configuration.access_token_expires_in.to_i
        )

        render json: {
          user: {
            name: user.name,
            email: user.email
          },
          user_id: user.id,
          token_type: 'Bearer',
          access_token: access_token.token,
          expires_in: access_token.expires_in,
          created_at: access_token.created_at.to_i,
          refresh_token: access_token.refresh_token
        }, status: :ok
      rescue StandardError => e
        render json: {error: e.message}, status: :unauthorized
      end

      private

      def find_or_create_user(user_data)
        existing_user = User.find_by(
          'email = :email OR firebase_uid = :firebase_uid',
          email: user_data[:identifier],
          firebase_uid: user_data[:uid]
        )

        if existing_user.present?
          existing_user.update!(confirmed_at: Time.current) if existing_user.confirmed_at.nil?
          return existing_user
        end

        User.create!(
          name: user_data[:name],
          email: user_data[:identifier],
          firebase_provider: user_data[:firebase_provider],
          password: SecureRandom.hex(12),
          confirmed_at: Time.current
        )
      end

      def fetch_user_data_from_token(token)
        decoded_token = FirebaseAdmin.auth.verify_id_token(token)
        user = FirebaseAdmin.auth.get_user(decoded_token['uid']).to_h if decoded_token['email'].nil?

        identifier = if decoded_token['email'].present?
                       decoded_token['email']
                     elsif user['providerUserInfo'].first['email'].present?
                       user['providerUserInfo'].first['email']
                     elsif MAIL_REGEX.match?(user['screenName'])
                       user['screenName']
                     else
                       "#{user['screenName']}@yourdomain.com"
                     end

        {
          identifier:,
          uid: decoded_token['uid'],
          name: decoded_token['name'] || user['screenName'],
          firebase_provider: decoded_token['firebase']['sign_in_provider']
        }
      end
    end
  end
end
```

---

## Web3 Auth (Thirdweb) Implementation

### 1. Thirdweb Operation

```ruby
# app/concepts/authentication/operation/thirdweb.rb
module Authentication::Operation
  class Thirdweb < Trailblazer::Operation
    step :validate_jwt
    step :extract_user_info
    step :find_or_create_user
    step :generate_access_token

    def validate_jwt(ctx, params:, **)
      jwt_token = params[:jwt]
      jwk_url = ENV['JWKS_AUTHENTICATION_SVC_URL'] || 'http://localhost:3002/.well-known/jwks.json'
      ctx[:payload] = decode_jwt(jwt_token, jwk_url)
      ctx[:payload].present?
    end

    def extract_user_info(ctx, **)
      payload = ctx[:payload]
      return ctx[:error] = 'Payload is missing' if payload.nil?

      user = ctx[:payload]['user']

      if !user.nil?
        profile = user['profiles'].first
        user_details = profile['details']
        ctx[:auto_confirmed] = false

        case profile['type']
        when 'telegram'
          ctx[:email] = "generated_email+#{user_details['username']}.telegram.#{SecureRandom.hex(10)}@yourdomain.com"
          ctx[:name] = "#{user_details['firstName']} #{user_details['lastName']}"
        when 'google'
          ctx[:email] = user_details['email']
          ctx[:name] = user_details['name']
        when 'github'
          ctx[:email] = "generated_email+#{user_details['username']}.github.#{SecureRandom.hex(10)}@yourdomain.com"
          ctx[:name] = user_details['name']
        when 'discord'
          ctx[:email] = user_details['email']
          ctx[:name] = user_details['username']
        when 'x'
          ctx[:email] = "generated_email+#{user_details['username']}.x.#{SecureRandom.hex(10)}@yourdomain.com"
          ctx[:name] = user_details['name']
        when 'email'
          ctx[:email] = user_details['email']
          ctx[:name] = user_details['email'].split('@').first
        when 'phone'
          ctx[:email] = "generated_email+#{user_details['phone']}.phone.#{SecureRandom.hex(10)}@yourdomain.com"
          ctx[:name] = 'Phone User'
        when 'passkey'
          ctx[:email] = "generated_email+#{user_details['id']}.passkey.#{SecureRandom.hex(10)}@yourdomain.com"
          ctx[:name] = 'Passkey User'
        else
          ctx[:error] = 'Unsupported profile type'
          return false
        end

        ctx[:thirdweb_metadata] = user
      else
        # Wallet authentication
        ctx[:email] = "generated_email+wallet.thirdweb.#{SecureRandom.hex(10)}@yourdomain.com"
        ctx[:name] = 'Wallet User'
        ctx[:auto_confirmed] = false

        thirdweb_metadata = {
          'type' => 'wallet',
          'address' => ctx[:payload]['sub']
        }

        ctx[:thirdweb_metadata] = thirdweb_metadata
      end
      true
    end

    def find_or_create_user(ctx, **)
      thirdweb_metadata = ctx[:thirdweb_metadata]
      address_wallet = thirdweb_metadata['walletAddress'] || thirdweb_metadata['address']
      user_id = thirdweb_metadata['userId']
      email = ctx[:email]
      name = ctx[:name]
      auto_confirmed = ctx[:auto_confirmed]

      user = User.find_by("email = ? OR
                           thirdweb_metadata ->> 'userId' = ? OR
                           thirdweb_metadata ->> 'address' = ?",
                          email, user_id, address_wallet)

      user ||= User.create!(
        email:,
        name:,
        confirmed_at: auto_confirmed ? Time.current : nil,
        password: SecureRandom.hex(10),
        thirdweb_metadata:
      )

      updates = {}
      updates[:thirdweb_metadata] = thirdweb_metadata if user.thirdweb_metadata != thirdweb_metadata
      updates[:confirmed_at] = Time.current if user.confirmed_at.nil? && auto_confirmed

      user.update!(updates) if updates.present?
      ctx[:user] = user
    end

    def generate_access_token(ctx, params:, **)
      thirdweb_app_id = params[:client_id]
      thirdweb_app_secret = params[:client_secret]
      application = Doorkeeper::Application.find_by(uid: thirdweb_app_id, secret: thirdweb_app_secret)
      return false unless application

      access_token = Doorkeeper::AccessToken.create!(
        application_id: application.id,
        resource_owner_id: ctx[:user].id,
        expires_in: Doorkeeper.configuration.access_token_expires_in,
        scopes: 'public',
        use_refresh_token: true
      )
      ctx[:access_token] = access_token
    end

    private

    def decode_jwt(token, jwk_url)
      jwk_set = fetch_jwk_set(jwk_url)
      header = jwk_set['keys'].first
      kid = header['kid']
      jwk = find_jwk(jwk_set, kid)

      if jwk
        public_key = JWT::JWK.import(jwk).public_key
        begin
          JWT.decode(token, public_key, true, {algorithm: 'RS256'}).first
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT Decode Error: #{e.message}"
          nil
        end
      else
        Rails.logger.error "JWK with kid #{kid} not found"
        nil
      end
    end

    def fetch_jwk_set(jwk_url)
      uri = URI.parse(jwk_url)
      request = Net::HTTP::Get.new(uri)

      unless uri.host == 'localhost' || uri.host == '127.0.0.1'
        gw_api_key = ENV['UC_GATEWAY_API_KEY'] || 'your_default_key'
        request['x-api-key'] = gw_api_key
      end

      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
        http.request(request)
      end

      JSON.parse(response.body)
    end

    def find_jwk(jwk_set, kid)
      jwk_set['keys'].find { |key| key['kid'] == kid }
    end
  end
end
```

### 2. Add Thirdweb Auth to Controller

```ruby
# Add this method to your AuthController
def thirdweb_auth
  result = Authentication::Operation::Thirdweb.wtf?(params:)

  if result.success?
    token_response = Doorkeeper::OAuth::TokenResponse.new(result[:access_token])
    render json: token_response.body, status: :ok
  else
    render json: {error: result[:error] || 'Invalid JWT'}, status: :unauthorized
  end
rescue StandardError => e
  Rails.logger.error(e.message)
  Rails.logger.error(e.backtrace.join("\n"))
  render json: {error: e.message}, status: :internal_server_error
end
```

---

## Routes Configuration

### 1. Add Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Your existing routes...

  namespace :api do
    namespace :v1 do
      resources :auth, only: %i[], defaults: { format: 'json' } do
        collection do
          post :firebase_auth
          post :thirdweb_auth
        end
      end
    end
  end
end
```

### 2. Doorkeeper Configuration

```ruby
# config/initializers/doorkeeper.rb
Doorkeeper.configure do
  orm :active_record

  resource_owner_authenticator do
    current_user || warden.authenticate!(scope: :user)
  end

  resource_owner_from_credentials do |_routes|
    user = User.find_for_database_authentication(email: params[:email])
    raise Doorkeeper::Errors::DoorkeeperError.new("wrong_email") if user.nil?

    raise Doorkeeper::Errors::DoorkeeperError.new("wrong_password") unless user.valid_password?(params[:password])

    if user&.valid_for_authentication? { user.valid_password?(params[:password]) } && user&.active_for_authentication?
      request.env["warden"].set_user(user, scope: :user, store: false)
      user
    elsif !user&.confirmed?
      raise Doorkeeper::Errors::DoorkeeperError.new("unconfirmed_email")
    else
      raise Doorkeeper::Errors::DoorkeeperError.new("server_error")
    end
  end

  # Add your OAuth applications here
  # You can create them via seeds or admin interface
end
```

---

## Testing

### 1. Route Tests

```ruby
# spec/routing/auth_routing_spec.rb
require "rails_helper"

RSpec.describe Api::V1::AuthController, type: :routing do
  describe "routing" do
    it "routes to #firebase_auth" do
      expect(post: "/api/v1/auth/firebase_auth").to route_to("api/v1/auth#firebase_auth", format: "json")
    end

    it "routes to #thirdweb_auth" do
      expect(post: "/api/v1/auth/thirdweb_auth").to route_to("api/v1/auth#thirdweb_auth", format: "json")
    end
  end
end
```

### 2. Controller Tests

```ruby
# spec/controllers/api/v1/auth_controller_spec.rb
require 'rails_helper'

RSpec.describe Api::V1::AuthController, type: :controller do
  describe 'POST #firebase_auth' do
    let(:valid_token) { 'valid_firebase_token' }
    let(:invalid_token) { 'invalid_token' }

    context 'with valid token' do
      before do
        allow(FirebaseAdmin.auth).to receive(:verify_id_token).and_return({
          'uid' => 'user123',
          'email' => 'test@example.com',
          'name' => 'Test User',
          'firebase' => { 'sign_in_provider' => 'google.com' }
        })
      end

      it 'creates user and returns access token' do
        post :firebase_auth, params: { firebase_token: valid_token }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include('access_token')
      end
    end

    context 'with invalid token' do
      before do
        allow(FirebaseAdmin.auth).to receive(:verify_id_token).and_raise(StandardError.new('Invalid token'))
      end

      it 'returns unauthorized error' do
        post :firebase_auth, params: { firebase_token: invalid_token }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST #thirdweb_auth' do
    let(:valid_jwt) { 'valid_jwt_token' }
    let(:invalid_jwt) { 'invalid_jwt' }

    context 'with valid JWT' do
      before do
        allow_any_instance_of(Authentication::Operation::Thirdweb).to receive(:wtf?).and_return(
          double(success?: true, '[]': double(token: 'access_token_123'))
        )
      end

      it 'returns access token' do
        post :thirdweb_auth, params: { jwt: valid_jwt }

        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid JWT' do
      before do
        allow_any_instance_of(Authentication::Operation::Thirdweb).to receive(:wtf?).and_return(
          double(success?: false, '[]': 'Invalid JWT')
        )
      end

      it 'returns unauthorized error' do
        post :thirdweb_auth, params: { jwt: invalid_jwt }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
```

---

## Migration Steps

### Step 1: Setup Dependencies

```bash
# Add gems to Gemfile
bundle add firebase-admin-sdk jwt doorkeeper devise trailblazer

# Install gems
bundle install
```

### Step 2: Database Migration

```bash
# Generate and run migrations
rails generate migration AddFirebaseFieldsToUsers firebase_uid:string firebase_provider:string
rails generate migration AddThirdwebFieldsToUsers thirdweb_metadata:jsonb

# Run migrations
rails db:migrate
```

### Step 3: Copy Files

```bash
# Copy the following files to your project:
# - lib/firebase_admin.rb
# - app/controllers/api/v1/auth_controller.rb
# - app/concepts/authentication/operation/thirdweb.rb
# - config/initializers/doorkeeper.rb (update existing)
```

### Step 4: Update User Model

```ruby
# Add fields to your User model
# Update devise configuration
# Add associations
```

### Step 5: Environment Variables

```bash
# Add to your .env file
FIREBASE_SA_KEY=your_base64_encoded_service_account_key
OAUTH_APPLICATION_ID=your_oauth_app_id
JWKS_AUTHENTICATION_SVC_URL=https://your-auth-service.com/.well-known/jwks.json
UC_GATEWAY_API_KEY=your_gateway_api_key
```

### Step 6: Routes

```ruby
# Add to config/routes.rb
namespace :api do
  namespace :v1 do
    resources :auth, only: %i[], defaults: { format: 'json' } do
      collection do
        post :firebase_auth
        post :thirdweb_auth
      end
    end
  end
end
```

### Step 7: Seeds (Optional)

```ruby
# db/seeds.rb
doorkeeper_app_thirdweb = Doorkeeper::Application.find_or_create_by(name: "thirdweb") do |app|
  app.redirect_uri = ENV["DOORKEEPER_REDIRECT_URI"]
  app.scopes = "public"
end

puts 'Thirdweb Application: '
puts "name: #{doorkeeper_app_thirdweb.name}"
puts "redirect_uri: #{doorkeeper_app_thirdweb.redirect_uri}"
puts "uid: #{doorkeeper_app_thirdweb.uid}"
puts "secret: #{doorkeeper_app_thirdweb.secret}"
```

### Step 8: Test

```bash
# Run tests
rspec spec/routing/auth_routing_spec.rb
rspec spec/controllers/api/v1/auth_controller_spec.rb
```

---

## API Endpoints

### Firebase Auth

```
POST /api/v1/auth/firebase_auth
Content-Type: application/json

{
  "firebase_token": "your_firebase_id_token"
}

Response:
{
  "user": {
    "name": "User Name",
    "email": "user@example.com"
  },
  "user_id": "user_id",
  "token_type": "Bearer",
  "access_token": "oauth_access_token",
  "expires_in": 7200,
  "created_at": 1234567890,
  "refresh_token": "refresh_token"
}
```

### Web3 Auth (Thirdweb)

```
POST /api/v1/auth/thirdweb_auth
Content-Type: application/json

{
  "jwt": "your_thirdweb_jwt_token",
  "client_id": "your_oauth_client_id",
  "client_secret": "your_oauth_client_secret"
}

Response:
{
  "access_token": "oauth_access_token",
  "token_type": "Bearer",
  "expires_in": 7200,
  "refresh_token": "refresh_token",
  "scope": "public"
}
```

---

## Troubleshooting

### Common Issues

1. **Firebase Admin SDK Error**
   - Ensure `FIREBASE_SA_KEY` is base64 encoded
   - Verify Firebase project configuration

2. **JWT Decode Error**
   - Check `JWKS_AUTHENTICATION_SVC_URL` is accessible
   - Verify JWT token format

3. **OAuth Application Not Found**
   - Create OAuth application via seeds or admin interface
   - Verify `client_id` and `client_secret`

4. **Database Migration Errors**
   - Ensure PostgreSQL supports JSONB (for thirdweb_metadata)
   - Check for existing columns before migration

### Debug Commands

```bash
# Check environment variables
rails console
ENV['FIREBASE_SA_KEY']
ENV['JWKS_AUTHENTICATION_SVC_URL']

# Test Firebase connection
rails console
FirebaseAdmin.auth.get_user('test_uid')

# Test JWT decoding
rails console
require 'jwt'
# Test your JWT token
```

---

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **Token Validation**: Always validate tokens server-side
3. **Rate Limiting**: Implement rate limiting for auth endpoints
4. **HTTPS**: Use HTTPS in production
5. **Token Expiration**: Set appropriate token expiration times
6. **Error Handling**: Don't expose sensitive information in error messages

---

## Production Checklist

- [ ] Set up environment variables
- [ ] Configure Firebase project
- [ ] Set up Thirdweb authentication service
- [ ] Create OAuth applications
- [ ] Test both authentication methods
- [ ] Set up monitoring and logging
- [ ] Configure CORS if needed
- [ ] Set up SSL certificates
- [ ] Test error handling
- [ ] Monitor token usage and performance
