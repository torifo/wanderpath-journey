import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import type { CreateTripData } from '../types/trip';

const CreateTripPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateTripData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    prefecture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!formData.title.trim()) {
      setError('旅行のタイトルを入力してください');
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      setError('出発日と帰着日を入力してください');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      setError('出発日は帰着日より前の日付を選択してください');
      return;
    }

    try {
      setLoading(true);
      const trip = await tripService.createTrip(formData);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError('旅行の作成に失敗しました');
      console.error('Error creating trip:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* ヘッダー */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-white hover:text-white/80 transition-colors">
                Wanderpath Journey
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white/80">
                こんにちは、{user?.email}さん
              </span>
              <button
                onClick={logout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white
                         px-4 py-2 rounded-lg transition-all duration-200
                         border border-red-500/30 hover:border-red-500/50"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to="/trips" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            旅行一覧に戻る
          </Link>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">新しい旅行を作成</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-white/90 text-sm font-medium mb-2">
                旅行のタイトル *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                placeholder="例: 春の京都旅行"
                required
              />
            </div>

            {/* 説明 */}
            <div>
              <label htmlFor="description" className="block text-white/90 text-sm font-medium mb-2">
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 
                         text-white placeholder-white/50 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent backdrop-blur-sm resize-none"
                placeholder="旅行の詳細や目的を記入してください"
              />
            </div>

            {/* 日程 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-white/90 text-sm font-medium mb-2">
                  出発日 *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block text-white/90 text-sm font-medium mb-2">
                  帰着日 *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 
                           text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* 都道府県 */}
            <div>
              <label htmlFor="prefecture" className="block text-white/90 text-sm font-medium mb-2">
                主な訪問先（都道府県）
              </label>
              <select
                id="prefecture"
                name="prefecture"
                value={formData.prefecture}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 
                         text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">選択してください</option>
                {prefectures.map((prefecture) => (
                  <option key={prefecture} value={prefecture} className="bg-gray-800">
                    {prefecture}
                  </option>
                ))}
              </select>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                to="/trips"
                className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-200 hover:text-white
                         rounded-lg transition-all duration-200 border border-gray-500/30 hover:border-gray-500/50"
              >
                キャンセル
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                         hover:from-blue-600 hover:to-purple-700 text-white font-semibold 
                         rounded-lg transition-all duration-200 transform hover:scale-105
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? '作成中...' : '旅行を作成'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTripPage;