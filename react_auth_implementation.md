# React認証機能実装設計

## 概要
既存のDevise認証UIを忠実に再現し、JWT認証システムと統合したReact認証コンポーネントの実装設計。

## 実装コンポーネント

### 1. AuthContext (認証状態管理)

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, AuthState, AuthAction } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGIN_FAILURE':
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Token validation and user info retrieval
      authService.validateToken(token)
        .then(user => dispatch({ type: 'LOGIN_SUCCESS', payload: user }))
        .catch(() => localStorage.removeItem('auth_token'));
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const signup = async (userData: SignupData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.signup(userData);
      const { user, token } = response.data;
      localStorage.setItem('auth_token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. AuthLayout (認証ページレイアウト)

```typescript
// src/components/auth/AuthLayout.tsx
import React from 'react';
import ParticleBackground from '../common/ParticleBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
      
      {/* パーティクルエフェクト */}
      <ParticleBackground />
      
      {/* メインコンテンツ */}
      <div className="min-h-screen flex items-center justify-center py-12 px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* ヘッダー */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Wanderpath Journey
            </h1>
            <p className="text-lg text-white/80 drop-shadow">
              あなたの旅の軌跡をより鮮明に可視化しよう！
            </p>
          </div>
          
          {/* 認証カード */}
          <div className="auth-card rounded-2xl shadow-2xl px-12 py-10 border border-white/20 backdrop-blur-sm bg-white/95">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
```

### 3. LoginForm (ログインフォーム)

```typescript
// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/auth';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto text-center">
      <div className="w-full max-w-xs mx-auto">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          ログイン
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          アカウントにアクセスして旅の記録を続けましょう
        </p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div className="rounded-md shadow-sm -space-y-px text-left">
            <div>
              <label htmlFor="email" className="sr-only">メールアドレス</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">パスワード</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                ログイン状態を記憶する
              </label>
            </div>

            <div className="text-center text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                パスワードを忘れた場合
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
          
          <div className="text-center text-sm mt-4">
            <span>または </span>
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              アカウントをお持ちでない場合 新規登録
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
```

### 4. 型定義

```typescript
// src/types/auth.ts
export interface User {
  id: number;
  email: string;
  username?: string;
  admin: boolean;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirmation: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };
```

### 5. 認証サービス

```typescript
// src/services/authService.ts
import { apiClient } from './api';
import { LoginCredentials, SignupData, User } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/users/sign_in', { user: credentials });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.delete('/users/sign_out');
    return response.data;
  },

  signup: async (userData: SignupData) => {
    const response = await apiClient.post('/users/sign_up', { user: userData });
    return response.data;
  },

  validateToken: async (token: string): Promise<User> => {
    const response = await apiClient.get('/users/current', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  }
};
```

## スタイル継承

### CSS設定（globals.css）

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .auth-card {
    @apply backdrop-blur-sm;
    background: rgba(255, 255, 255, 0.95) !important;
  }
  
  .btn-primary {
    @apply bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700;
  }
}

/* パーティクルエフェクトのスタイル */
.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}
```

## 実装手順

### Phase 1: 基本認証機能
1. AuthContext とuseAuth hookの実装
2. 認証サービスの実装
3. 型定義の作成

### Phase 2: UI コンポーネント
1. AuthLayoutの実装
2. LoginFormの実装
3. ParticleBackgroundの実装

### Phase 3: 統合とテスト
1. React Routerとの統合
2. 認証ガードの実装
3. エラーハンドリングの実装

### Phase 4: 高度な機能
1. パスワードリセット機能
2. 新規登録機能
3. 認証状態の永続化

## セキュリティ考慮事項

1. **Token Storage**: JWTトークンの安全な保存
2. **CSRF Protection**: API リクエストでのCSRF対策
3. **Input Validation**: フォーム入力の検証
4. **Error Handling**: セキュリティ情報の漏洩防止

この設計に基づいて、既存の美しいDevise認証UIを完全に再現しながら、モダンなReact認証システムを構築できます。