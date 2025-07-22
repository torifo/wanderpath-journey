# frozen_string_literal: true

class AddUserToTrips < ActiveRecord::Migration[7.2]
  def change
    # ステップ1：まず`user`カラムを、`null`（空）を許容する形で追加します
    add_reference :trips, :user, null: true, foreign_key: true

    # ステップ2：ユーザーが紐付いていない既存の全ての旅行データに、
    # 最初のユーザーをオーナーとして割り当てます。
    # これにより、既存のデータでエラーが発生するのを防ぎます。
    if User.any?
      first_user = User.first
      Trip.where(user_id: nil).update_all(user_id: first_user.id)
    end

    # ステップ3：全ての旅行データにユーザーが紐付いたので、「空であってはならない」というルールを適用します。
    change_column_null :trips, :user_id, false
  end
end