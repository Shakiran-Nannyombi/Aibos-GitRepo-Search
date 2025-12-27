import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { RepoCard } from '../../components/RepoCard'

describe('RepoCard', () => {
  const mockRepo = {
    id: 1,
    full_name: 'test/repo',
    html_url: 'https://github.com/test/repo',
    description: 'A test repository description',
    language: 'JavaScript',
    stargazers_count: 100,
    forks_count: 50,
    updated_at: new Date().toISOString(),
    owner: {
      login: 'testowner',
      avatar_url: 'https://github.com/avatar.png'
    }
  }

  // Mock localStorage
  const localStorageMock = (() => {
    let store = {}
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString()
      }),
      clear: vi.fn(() => {
        store = {}
      }),
      removeItem: vi.fn(key => {
        delete store[key]
      })
    }
  })()

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })

  beforeEach(() => {
    localStorageMock.clear()
    cleanup()
    vi.clearAllMocks()
    vi.spyOn(window, 'dispatchEvent')
  })

  it('renders repository information correctly', () => {
    render(<RepoCard repo={mockRepo} />)
    
    expect(screen.getByText('test/repo')).toBeInTheDocument()
    expect(screen.getByText('A test repository description')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByAltText('testowner')).toBeInTheDocument()
  })

  it('handles saving a repository to localStorage', () => {
    render(<RepoCard repo={mockRepo} />)
    
    const saveButton = screen.getByTitle('Save repository')
    fireEvent.click(saveButton)
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('saved_repos', expect.stringContaining('"id":1'))
    expect(window.dispatchEvent).toHaveBeenCalled()
    // Re-render to check if state updated (though it should update internally)
    expect(screen.getByTitle('Remove from saved')).toBeInTheDocument()
  })

  it('handles removing a repository from localStorage', () => {
    localStorageMock.setItem('saved_repos', JSON.stringify([mockRepo]))
    
    render(<RepoCard repo={mockRepo} />)
    
    const removeButton = screen.getByTitle('Remove from saved')
    fireEvent.click(removeButton)
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('saved_repos', '[]')
    expect(screen.getByTitle('Save repository')).toBeInTheDocument()
  })

  it('renders "Today" for current date', () => {
    render(<RepoCard repo={mockRepo} />)
    expect(screen.getByText(/Updated Today/)).toBeInTheDocument()
  })
})
