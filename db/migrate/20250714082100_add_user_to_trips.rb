# frozen_string_literal: true

class AddUserToTrips < ActiveRecord::Migration[7.2]
  def change
    add_reference :trips, :user, null: false, foreign_key: true
  end
end