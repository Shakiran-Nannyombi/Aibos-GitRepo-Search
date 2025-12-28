import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function Signup() {
  usePageTitle('Register');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await registerUser(email, username, password);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Email might be already taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-background px-4 pt-40">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted">Join the community</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Username</label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-accent focus:border-accent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-medium text-accent hover:text-accent-hover">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
