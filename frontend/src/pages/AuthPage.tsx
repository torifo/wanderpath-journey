import React, { useState } from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthLayout title={isLogin ? 'ログイン' : '新規登録'}>
      {isLogin ? (
        <LoginForm onSignupClick={toggleAuthMode} />
      ) : (
        <SignupForm onLoginClick={toggleAuthMode} />
      )}
    </AuthLayout>
  );
};

export default AuthPage;