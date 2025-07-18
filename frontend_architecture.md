# React Frontend Architecture Design

## 概要
Wanderpath-JourneyアプリケーションのフロントエンドをReactに移行する設計ドキュメント。

## 技術スタック
- **Frontend**: React 18 + TypeScript
- **状態管理**: React Context API / Redux Toolkit
- **UI Framework**: Tailwind CSS + Headless UI
- **HTTP Client**: Axios
- **認証**: JWT Token based
- **マップ**: Leaflet.js + React-Leaflet
- **ルーティング**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

## プロジェクト構造

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Loading.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── trips/
│   │   │   ├── TripList.tsx
│   │   │   ├── TripCard.tsx
│   │   │   ├── TripForm.tsx
│   │   │   └── TripDetail.tsx
│   │   ├── map/
│   │   │   ├── MapContainer.tsx
│   │   │   ├── MapMarker.tsx
│   │   │   └── MapRoute.tsx
│   │   └── spots/
│   │       ├── SpotList.tsx
│   │       ├── SpotForm.tsx
│   │       └── SpotCard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTrips.ts
│   │   ├── useSpots.ts
│   │   └── useMap.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── tripService.ts
│   │   └── spotService.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── TripContext.tsx
│   │   └── NotificationContext.tsx
│   ├── types/
│   │   ├── auth.ts
│   │   ├── trip.ts
│   │   ├── spot.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TripListPage.tsx
│   │   ├── TripDetailPage.tsx
│   │   └── SpotListPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 主要コンポーネント設計

### 1. 認証システム
- `AuthContext`: JWT認証状態管理
- `LoginForm`: 既存デザインを再現したログインフォーム
- `AuthLayout`: 認証ページ用レイアウト（すりガラス効果付き）

### 2. 旅行管理
- `TripList`: 旅行一覧表示（フィルタリング機能付き）
- `TripForm`: 旅行作成・編集フォーム
- `TripDetail`: 旅行詳細表示（マップ統合）

### 3. マップ機能
- `MapContainer`: Leafletマップコンテナ
- `MapMarker`: スポットマーカー
- `MapRoute`: 旅行ルート表示

### 4. 状態管理
- `useAuth`: 認証状態とメソッド
- `useTrips`: 旅行データ管理
- `useSpots`: スポットデータ管理

## API統合設計

### Base API Service
```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT Token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 認証サービス
```typescript
// services/authService.ts
export const authService = {
  login: (credentials: LoginCredentials) => 
    apiClient.post('/users/sign_in', credentials),
  
  logout: () => 
    apiClient.delete('/users/sign_out'),
  
  signup: (userData: SignupData) => 
    apiClient.post('/users/sign_up', userData),
};
```

## 段階的移行計画

### Phase 1: 認証機能の移行
1. React認証フォームの実装
2. JWT認証の統合
3. 認証状態管理の実装

### Phase 2: 旅行管理機能の移行
1. 旅行一覧表示の実装
2. 旅行作成・編集機能の実装
3. 旅行詳細表示の実装

### Phase 3: マップ機能の移行
1. React-Leafletの統合
2. マップ表示機能の実装
3. スポットマーカーとルート表示の実装

### Phase 4: 全機能統合とテスト
1. 全機能の統合テスト
2. パフォーマンス最適化
3. 本番環境への移行

## 開発環境設定

### 1. プロジェクト初期化
```bash
# Vite + React + TypeScript
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### 2. 必要な依存関係
```bash
# Core dependencies
npm install react-router-dom axios
npm install leaflet react-leaflet
npm install @headlessui/react @heroicons/react

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/leaflet
```

### 3. 設定ファイル
- `tailwind.config.js`: Tailwind CSS設定
- `vite.config.ts`: Vite設定（プロキシ設定含む）
- `tsconfig.json`: TypeScript設定

## デザイン継承

### 既存UIの再現
- すりガラス効果の認証カード
- グラデーション背景
- パーティクルエフェクト
- レスポンシブデザイン

### スタイリング方針
- Tailwind CSSクラスの使用
- CSS Modulesまたはstyled-componentsの併用
- 既存のカラーパレットとスタイリングの継承

## 次のステップ

1. **フロントエンドプロジェクトの初期化**
2. **認証機能の実装**
3. **API統合の実装**
4. **段階的な機能移行**
5. **テストとデバッグ**
6. **本番環境への移行**

このアーキテクチャに基づいて、段階的にReactフロントエンドの実装を進めていきます。