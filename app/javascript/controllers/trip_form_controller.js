import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="trip-form"
export default class extends Controller {
  // フォーム内の要素をターゲットとして定義
  static targets = ["startDate", "endDate", "tripType"]

  // 「日帰り」または「ぷらっと」が選択された場合、
  // 開始日と終了日を同期させる
  syncDates() {
    const selectedType = this.tripTypeTarget.value
    if (selectedType === "日帰り" || selectedType === "ぷらっと") {
      this.endDateTarget.value = this.startDateTarget.value
    }
  }

  // フォーム送信前に確認ダイアログを表示する
  confirmSubmit(event) {
    const message = "この内容で旅行を登録しますか？";
    // ブラウザの標準的な確認ダイアログを表示
    if (!confirm(message)) {
      // ユーザーが「キャンセル」を押した場合、フォームの送信を中止する
      event.preventDefault()
    }
  }
}
