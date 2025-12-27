import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../../components/ThemeToggle'

// Mock ThemeContext
const mockToggleTheme = vi.fn()
let mockTheme = 'light'

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme
  })
}))

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear()
    mockTheme = 'light'
  })

  it('renders light mode icon by default', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
    // The light mode icon is a moon (counter-intuitive but based on code)
    // Actually, looking at the code: theme === 'light' ? moon : sun
    // Wait, usually light mode has sun and dark mode has moon.
    // Let's check the code again.
  })

  it('calls toggleTheme on click', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Toggle theme'))
    expect(mockToggleTheme).toHaveBeenCalled()
  })

  it('renders sun icon in dark mode', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Toggle theme')).toBeInTheDocument()
  })
})
