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

describe('AuthCallback', () => {
  let cookieSpy

  beforeEach(() => {
    mockSetUser.mockClear()
    mockNavigate.mockClear()
    
    // Mock document.cookie
    cookieSpy = vi.spyOn(document, 'cookie', 'get').mockReturnValue('')
    vi.spyOn(document, 'cookie', 'set').mockImplementation(() => {})
  })

  afterEach(() => {
    cookieSpy.mockRestore()
    vi.restoreAllMocks()
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

  it('handles successful authentication with valid cookie', async () => {
    const mockUser = {
      id: 12345,
      login: 'testuser',
      name: 'Test User',
      avatar_url: 'https://github.com/images/error/testuser_happy.gif'
    }
    
    // Mock the user_data cookie
    cookieSpy.mockReturnValue(`user_data=${encodeURIComponent(JSON.stringify(mockUser))}`)
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    })
    
    // Wait for navigation timeout (500ms)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    }, { timeout: 1000 })
  })

  it('handles missing cookie', async () => {
    cookieSpy.mockReturnValue('')
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=auth_failed', { replace: true })
    })
    
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('handles invalid JSON in cookie', async () => {
    cookieSpy.mockReturnValue('user_data=invalid_json')
    
    renderAuthCallback()
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/?error=auth_failed', { replace: true })
    })
    
    expect(mockSetUser).not.toHaveBeenCalled()
  })
})
