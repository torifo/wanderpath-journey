# データベースをクリーンな状態にするため、関連性の深いモデルから順に削除
puts "既存のデータを削除しています..."
Leg.destroy_all
Transportation.destroy_all
Spot.destroy_all
Trip.destroy_all
User.destroy_all

puts "テストデータの作成を開始します..."

# 管理者ユーザーの作成（ユーザー要求に合わせて修正）
admin = User.create!(
  email: "adminAexaple.com",
  username: "admin",
  password: "password",
  password_confirmation: "password",
  admin: true
)

puts "  - 管理者ユーザーを作成しました (adminAexaple.com/password)"

# テストユーザーの作成
test_user = User.create!(
  email: "test123@example.com",
  username: "test123",
  password: "password123",
  password_confirmation: "password123",
  admin: false
)

puts "  - テストユーザーを作成しました (test123/password123)"

# 1. 移動手段のマスターデータを作成
train = Transportation.create!(category: "電車", name: "JR中央線")
shinkansen = Transportation.create!(category: "電車", name: "新幹線")
bus = Transportation.create!(category: "バス", name: "高速バス")
walk = Transportation.create!(category: "徒歩", name: "徒歩")

# 2. スポット（場所）のマスターデータを作成
factory = RGeo::Geographic.spherical_factory(srid: 4326)
tokyo_station = Spot.create!(name: "東京駅", prefecture: "東京都", location: factory.point(139.767125, 35.681236), spot_type: "destination")
sendai_station = Spot.create!(name: "仙台駅", prefecture: "宮城県", location: factory.point(140.882463, 38.260146), spot_type: "destination")
sano_sa = Spot.create!(name: "佐野SA", prefecture: "栃木県", location: factory.point(139.59393, 36.29773), spot_type: "waypoint")

# 3. 旅行データを作成
trip1 = Trip.create!(
  title: "バスで行く仙台の旅",
  start_date: "2025-08-20",
  end_date: "2025-08-20",
  trip_type: "日帰り",
  user: admin  # 管理者ユーザーに関連付け
)

# 4. 移動区間（Leg）データを作成
puts "  - 移動区間を作成中..."
# 1つ目の行程
Leg.create!(
  trip: trip1,
  segment: "東京-仙台間", # 行程名を指定
  origin_spot: tokyo_station,
  destination_spot: sano_sa,
  transportation: bus,
  departure_time: Time.zone.parse("2025-08-20 08:00:00"),
  arrival_time: Time.zone.parse("2025-08-20 09:30:00")
)
Leg.create!(
  trip: trip1,
  segment: "東京-仙台間", # 同じ行程名を指定
  origin_spot: sano_sa,
  destination_spot: sendai_station,
  transportation: bus,
  departure_time: Time.zone.parse("2025-08-20 09:45:00"),
  arrival_time: Time.zone.parse("2025-08-20 12:30:00")
)
# 2つ目の行程
Leg.create!(
  trip: trip1,
  segment: "仙台市内", # 別の行程名
  origin_spot: sendai_station,
  destination_spot: sendai_station, # 仮で同じにしておく
  transportation: walk,
  departure_time: Time.zone.parse("2025-08-20 13:00:00"),
  arrival_time: Time.zone.parse("2025-08-20 13:15:00")
)

puts "テストデータの作成が完了しました！"
