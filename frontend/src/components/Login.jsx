import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { AuthCard, Field } from './AuthCard';

export function Login() {
  usePageTitle('Sign in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser, login } = useAuth(); // login is the GitHub OAuth redirect
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await loginUser(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('That email and password don’t match an account. Check them, or sign in with GitHub.');
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Pick up where you left off."
      githubLabel="Continue with GitHub"
      onGithub={login}
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Sign in with email"
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </AuthCard>
  );
}
