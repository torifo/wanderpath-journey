import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { LoginCredentials } from '../../types/auth';

interface LoginFormProps {
  onSignupClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSignupClick }) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      // エラーはAuthContextで処理される
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {/* メールアドレス */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/90">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                     backdrop-blur-sm text-white placeholder-white/50 
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                     transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>

        {/* パスワード */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white/90">
            パスワード
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg 
                       backdrop-blur-sm text-white placeholder-white/50 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                       transition-all duration-200 pr-12"
              placeholder="パスワードを入力"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ログインボタン */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 
                   hover:from-blue-600 hover:to-purple-700 
                   text-white font-semibold py-3 px-6 rounded-lg 
                   transition-all duration-200 transform hover:scale-105 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                   shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ログイン中...
            </div>
          ) : (
            'ログイン'
          )}
        </button>

        {/* 新規登録リンク */}
        {onSignupClick && (
          <div className="text-center pt-4">
            <p className="text-white/70 text-sm">
              アカウントをお持ちでない方は{' '}
              <button
                type="button"
                onClick={onSignupClick}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                新規登録
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;