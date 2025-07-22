import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import type { Trip } from '../types/trip';

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const tripsData = await tripService.getAllTrips();
      setTrips(tripsData || []);
    } catch (err) {
      setError('旅行データの読み込みに失敗しました');
      setTrips([]); // エラー時でも空配列を保持
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    if (!window.confirm('この旅行を削除しますか？')) return;

    try {
      await tripService.deleteTrip(tripId);
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (err) {
      setError('旅行の削除に失敗しました');
      console.error('Error deleting trip:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: '下書き', color: 'bg-gray-500/20 text-gray-300' },
      planned: { label: '計画済み', color: 'bg-blue-500/20 text-blue-300' },
      in_progress: { label: '進行中', color: 'bg-yellow-500/20 text-yellow-300' },
      completed: { label: '完了', color: 'bg-green-500/20 text-green-300' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">旅行一覧</h1>
          <Link
            to="/trips/new"
            className="bg-gradient-to-r from-blue-500 to-purple-600 
                     hover:from-blue-600 hover:to-purple-700 
                     text-white font-semibold py-3 px-6 rounded-lg 
                     transition-all duration-200 transform hover:scale-105"
          >
            新しい旅行を作成
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {(trips || []).length === 0 ? (
          <div className="glass-card p-12 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl text-center">
            <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-white/60 text-lg mb-4">
              まだ旅行プランがありません
            </p>
            <p className="text-white/40 mb-6">
              新しい旅行を作成して始めましょう！
            </p>
            <Link
              to="/trips/new"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 
                       hover:from-blue-600 hover:to-purple-700 
                       text-white font-semibold py-3 px-6 rounded-lg 
                       transition-all duration-200 transform hover:scale-105"
            >
              最初の旅行を作成
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(trips || []).map((trip) => (
              <div key={trip.id} className="glass-card p-6 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {trip.title}
                  </h3>
                  {getStatusBadge(trip.status)}
                </div>
                
                {trip.description && (
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {trip.description}
                  </p>
                )}
                
                <div className="text-white/60 text-sm mb-4">
                  <p>{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                  {trip.prefecture && <p>📍 {trip.prefecture}</p>}
                  <p>✈️ {trip.spots?.length || 0}箇所</p>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/trips/${trip.id}`}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-white
                             py-2 px-3 rounded-lg transition-all duration-200 text-center text-sm
                             border border-blue-500/30 hover:border-blue-500/50"
                  >
                    詳細
                  </Link>
                  <Link
                    to={`/trips/${trip.id}/edit`}
                    className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 hover:text-white
                             py-2 px-3 rounded-lg transition-all duration-200 text-center text-sm
                             border border-yellow-500/30 hover:border-yellow-500/50"
                  >
                    編集
                  </Link>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white
                             py-2 px-3 rounded-lg transition-all duration-200 text-sm
                             border border-red-500/30 hover:border-red-500/50"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TripsPage;