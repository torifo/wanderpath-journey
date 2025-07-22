import React from 'react';
import ParticleBackground from '../common/ParticleBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* パーティクル背景 */}
      <ParticleBackground />
      
      {/* 浮遊する背景要素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Wanderpath
          </h1>
          <p className="text-white/80 text-lg drop-shadow">
            Journey
          </p>
        </div>

        {/* 認証カード */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {title}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>
          
          {children}
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            © 2025 Wanderpath Journey. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;