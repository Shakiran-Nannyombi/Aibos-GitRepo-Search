import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function Login() {
  usePageTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser, login } = useAuth(); // login is the github redirect
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await loginUser(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-background px-4 pt-40">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-accent focus:border-accent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-accent focus:border-accent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors"
          >
            Sign In with Email
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted">Or continue with</span>
          </div>
        </div>

        <button
          onClick={login}
          className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-foreground bg-background border border-border hover:bg-border/50 transition-colors"
        >
          GitHub
        </button>

        <p className="text-center text-sm text-muted">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="font-medium text-accent hover:text-accent-hover">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
