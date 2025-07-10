# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_07_10_105857) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "legs", force: :cascade do |t|
    t.datetime "departure_time"
    t.datetime "arrival_time"
    t.bigint "trip_id", null: false
    t.bigint "transportation_id", null: false
    t.bigint "origin_spot_id", null: false
    t.bigint "destination_spot_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "segment"
    t.index ["destination_spot_id"], name: "index_legs_on_destination_spot_id"
    t.index ["origin_spot_id"], name: "index_legs_on_origin_spot_id"
    t.index ["segment"], name: "index_legs_on_segment"
    t.index ["transportation_id"], name: "index_legs_on_transportation_id"
    t.index ["trip_id"], name: "index_legs_on_trip_id"
  end

  create_table "posts", force: :cascade do |t|
    t.string "title", null: false
    t.text "body"
    t.string "embed_url"
    t.bigint "spot_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["spot_id"], name: "index_posts_on_spot_id"
  end

  create_table "spots", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "prefecture"
    t.geography "location", limit: {:srid=>4326, :type=>"st_point", :geographic=>true}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "spot_type", default: "destination", null: false
    t.index ["location"], name: "index_spots_on_location", using: :gist
  end

  create_table "transportations", force: :cascade do |t|
    t.string "category", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "trips", force: :cascade do |t|
    t.string "title", null: false
    t.date "start_date"
    t.date "end_date"
    t.string "trip_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "legs", "spots", column: "destination_spot_id"
  add_foreign_key "legs", "spots", column: "origin_spot_id"
  add_foreign_key "legs", "transportations"
  add_foreign_key "legs", "trips"
  add_foreign_key "posts", "spots"
end
