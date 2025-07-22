import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* ヘッダー */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                Wanderpath Journey
              </h1>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 旅行作成カード */}
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                新しい旅行を作成
              </h3>
              <p className="text-white/70 mb-6">
                新しい旅行プランを作成して、思い出に残る旅を計画しましょう。
              </p>
              <Link to="/trips/new" className="block w-full bg-gradient-to-r from-blue-500 to-purple-600
                               hover:from-blue-600 hover:to-purple-700
                               text-white font-semibold py-3 px-6 rounded-lg
                               transition-all duration-200 transform hover:scale-105 text-center">
                旅行を作成
              </Link>
            </div>
          </div>

          {/* 旅行一覧カード */}
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                旅行一覧
              </h3>
              <p className="text-white/70 mb-6">
                これまでの旅行プランを確認・編集できます。
              </p>
              <Link to="/trips" className="block w-full bg-gradient-to-r from-green-500 to-teal-600
                               hover:from-green-600 hover:to-teal-700
                               text-white font-semibold py-3 px-6 rounded-lg
                               transition-all duration-200 transform hover:scale-105 text-center">
                一覧を見る
              </Link>
            </div>
          </div>

          {/* マップ表示カード */}
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                マップで探索
              </h3>
              <p className="text-white/70 mb-6">
                インタラクティブなマップで旅行先を探索しましょう。
              </p>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 
                               hover:from-purple-600 hover:to-pink-700 
                               text-white font-semibold py-3 px-6 rounded-lg 
                               transition-all duration-200 transform hover:scale-105">
                マップを開く
              </button>
            </div>
          </div>

        </div>

        {/* 最近の旅行セクション */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            最近の旅行
          </h2>
          
          <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white/60 text-lg">
                まだ旅行プランがありません
              </p>
              <p className="text-white/40">
                新しい旅行を作成して始めましょう！
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;