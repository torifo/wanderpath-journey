import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { useAuth } from '../context/AuthContext';
import type { Trip } from '../types/trip';

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadTrip(parseInt(id));
    }
  }, [id]);

  const loadTrip = async (tripId: number) => {
    try {
      setLoading(true);
      const tripData = await tripService.getTripById(tripId);
      setTrip(tripData);
    } catch (err) {
      setError('旅行データの読み込みに失敗しました');
      console.error('Error loading trip:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip || !window.confirm('この旅行を削除しますか？')) return;

    try {
      await tripService.deleteTrip(trip.id);
      navigate('/trips');
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getSpotTypeIcon = (spotType: string) => {
    const iconMap = {
      attraction: '🏛️',
      restaurant: '🍽️',
      hotel: '🏨',
      transportation: '🚆',
      other: '📍'
    };
    return iconMap[spotType as keyof typeof iconMap] || '📍';
  };

  const getSpotTypeLabel = (spotType: string) => {
    const labelMap = {
      attraction: '観光地',
      restaurant: 'レストラン',
      hotel: 'ホテル',
      transportation: '交通機関',
      other: 'その他'
    };
    return labelMap[spotType as keyof typeof labelMap] || 'その他';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">旅行が見つかりません</div>
          <Link
            to="/trips"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            旅行一覧に戻る
          </Link>
        </div>
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* 旅行情報カード */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">{trip.title}</h1>
                {getStatusBadge(trip.status)}
              </div>
              
              {trip.description && (
                <p className="text-white/80 text-lg mb-4">{trip.description}</p>
              )}
              
              <div className="flex flex-wrap gap-4 text-white/70">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </div>
                
                {trip.prefecture && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {trip.prefecture}
                  </div>
                )}
                
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {trip.spots?.length || 0}箇所
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link
                to={`/trips/${trip.id}/edit`}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 hover:text-white
                         px-4 py-2 rounded-lg transition-all duration-200
                         border border-yellow-500/30 hover:border-yellow-500/50"
              >
                編集
              </Link>
              <button
                onClick={handleDeleteTrip}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white
                         px-4 py-2 rounded-lg transition-all duration-200
                         border border-red-500/30 hover:border-red-500/50"
              >
                削除
              </button>
            </div>
          </div>
        </div>

        {/* スポット一覧 */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">訪問予定地</h2>
            <Link
              to={`/trips/${trip.id}/spots/new`}
              className="bg-gradient-to-r from-green-500 to-teal-600 
                       hover:from-green-600 hover:to-teal-700 
                       text-white font-semibold py-2 px-4 rounded-lg 
                       transition-all duration-200 transform hover:scale-105"
            >
              スポットを追加
            </Link>
          </div>

          {trip.spots && trip.spots.length > 0 ? (
            <div className="space-y-4">
              {trip.spots.map((spot) => (
                <div key={spot.id} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getSpotTypeIcon(spot.spot_type)}</span>
                        <h3 className="text-xl font-semibold text-white">{spot.name}</h3>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          {getSpotTypeLabel(spot.spot_type)}
                        </span>
                      </div>
                      
                      {spot.description && (
                        <p className="text-white/70 mb-3">{spot.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        {spot.address && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {spot.address}
                          </div>
                        )}
                        
                        {spot.visit_date && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(spot.visit_date)}
                            {spot.visit_time && ` ${spot.visit_time}`}
                          </div>
                        )}
                        
                        {spot.duration && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {spot.duration}分
                          </div>
                        )}
                        
                        {spot.cost && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            ¥{spot.cost.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      {spot.notes && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-white/70 text-sm">{spot.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Link
                        to={`/spots/${spot.id}/edit`}
                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 hover:text-white
                                 px-3 py-1 rounded-lg transition-all duration-200 text-sm
                                 border border-yellow-500/30 hover:border-yellow-500/50"
                      >
                        編集
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-white/60 text-lg mb-4">
                まだ訪問予定地が登録されていません
              </p>
              <p className="text-white/40 mb-6">
                最初のスポットを追加して旅行計画を始めましょう！
              </p>
              <Link
                to={`/trips/${trip.id}/spots/new`}
                className="inline-block bg-gradient-to-r from-green-500 to-teal-600 
                         hover:from-green-600 hover:to-teal-700 
                         text-white font-semibold py-3 px-6 rounded-lg 
                         transition-all duration-200 transform hover:scale-105"
              >
                最初のスポットを追加
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TripDetailPage;