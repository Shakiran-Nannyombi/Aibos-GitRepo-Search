import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthCallback } from '../../components/AuthCallback'

// Mock the AuthContext
const mockSetUser = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    setUser: mockSetUser
  })
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock localStorage
const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('AuthCallback', () => {
  beforeEach(() => {
    mockSetUser.mockClear()
    mockNavigate.mockClear()
    localStorageMock.setItem.mockClear()
    
    // Clear URL search params
    delete window.location
    window.location = { search: '' }
  })

  const renderAuthCallback = () => {
    return render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    )
  }

  it('renders loading spinner', () => {
    renderAuthCallback()
    
    expect(screen.getByText('Completing authentication...')).toBeInTheDocument()
  })

  it('handles successful authentication with valid token and user', async () => {
    const mockUser = {
      id: 12345,
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://github.com/images/error/testuser_happy.gif'
    }
    
    // Mock URL search params
    window.location.search = `?token=test_token&user=${encodeURIComponent(JSON.stringify(mockUser))}`
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('github_token', 'test_token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('github_user', JSON.stringify(mockUser))
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    })
    
    // Wait for navigation timeout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    }, { timeout: 1000 })
  })

  it('handles missing token parameter', async () => {
    window.location.search = '?user={"id":123,"login":"test"}'
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=missing_params', { replace: true })
    })
    
    expect(mockSetUser).not.toHaveBeenCalled()
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('handles missing user parameter', async () => {
    window.location.search = '?token=test_token'
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=missing_params', { replace: true })
    })
    
    expect(mockSetUser).not.toHaveBeenCalled()
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('handles invalid JSON in user parameter', async () => {
    window.location.search = '?token=test_token&user=invalid_json'
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=auth_failed', { replace: true })
    })
    
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('handles empty search params', async () => {
    window.location.search = ''
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=missing_params', { replace: true })
    })
  })
})
