import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { AuthCard, Field } from './AuthCard';

export function Signup() {
  usePageTitle('Create account');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registerUser, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await registerUser(email, username, password);
    if (success) {
      navigate('/login');
    } else {
      setError('We couldn’t create that account. The email may already be registered. Try signing in instead.');
    }
  };

  return (
    <AuthCard
      title="Create an account"
      subtitle="Save repositories and track your GitHub activity."
      githubLabel="Sign up with GitHub"
      onGithub={login}
      error={error}
      onSubmit={handleSubmit}
      submitLabel="Create account"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <Field id="username" label="Username" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field id="password" label="Password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </AuthCard>
  );
}
