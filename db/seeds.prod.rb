# 本番環境用シードデータ - 必要最低限のデータのみ

puts "本番環境用データの作成を開始します..."

# 既存のデータをクリーンアップ（本番では慎重に）
if Rails.env.production?
  puts "本番環境での初期セットアップです"
else
  puts "Warning: このファイルは本番環境用です"
end

# 1. 基本的な移動手段のマスターデータ
train = Transportation.find_or_create_by!(category: "電車", name: "電車")
bus = Transportation.find_or_create_by!(category: "バス", name: "バス") 
walk = Transportation.find_or_create_by!(category: "徒歩", name: "徒歩")
car = Transportation.find_or_create_by!(category: "車", name: "rレンタカー")

puts "  - 移動手段マスターデータを作成しました"

# 2. 本番管理者ユーザーの作成（環境変数から取得）
admin_email = ENV['ADMIN_EMAIL'] || 'admin@wanderpath.megu.riumu.net'
admin_password = ENV['ADMIN_PASSWORD'] || SecureRandom.hex(12)

admin = User.find_or_create_by!(email: admin_email) do |user|
  user.username = 'admin'
  user.password = admin_password
  user.password_confirmation = admin_password
  user.admin = true
end

puts "  - 本番管理者ユーザーを作成しました (#{admin_email})"

# 3. 基本的なスポットマスターデータ（主要駅など）
factory = RGeo::Geographic.spherical_factory(srid: 4326)

major_spots = [
  { name: "東京駅", prefecture: "東京都", lat: 35.681236, lng: 139.767125 },
  { name: "新宿駅", prefecture: "東京都", lat: 35.689487, lng: 139.700413 },
  { name: "大阪駅", prefecture: "大阪府", lat: 34.702485, lng: 135.495951 },
  { name: "京都駅", prefecture: "京都府", lat: 34.985849, lng: 135.758767 },
  { name: "仙台駅", prefecture: "宮城県", lat: 38.260146, lng: 140.882463 }
]

major_spots.each do |spot_data|
  Spot.find_or_create_by!(name: spot_data[:name]) do |spot|
    spot.prefecture = spot_data[:prefecture]
    spot.location = factory.point(spot_data[:lng], spot_data[:lat])
    spot.spot_type = "destination"
  end
end

puts "  - 主要スポットマスターデータを作成しました"

puts "本番環境用データの作成が完了しました！"
puts "管理者アカウント: #{admin_email}"
puts "管理者パスワード: #{admin_password}" unless ENV['ADMIN_PASSWORD']