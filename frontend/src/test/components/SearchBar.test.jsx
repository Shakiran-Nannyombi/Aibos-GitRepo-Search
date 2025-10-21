import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../../components/SearchBar'

describe('SearchBar', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  it('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    expect(screen.getByPlaceholderText('Search repositories...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
  })

  it('calls onSearch when form is submitted with valid query', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(input, 'react')
    await user.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('react')
  })

  it('calls onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    
    await user.type(input, 'vue')
    await user.keyboard('{Enter}')
    
    expect(mockOnSearch).toHaveBeenCalledWith('vue')
  })

  it('does not call onSearch with empty or whitespace query', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    // Try with empty string
    await user.click(searchButton)
    expect(mockOnSearch).not.toHaveBeenCalled()
    
    // Try with whitespace
    await user.type(input, '   ')
    await user.click(searchButton)
    expect(mockOnSearch).not.toHaveBeenCalled()
  })

  it('trims whitespace from query before calling onSearch', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    await user.type(input, '  angular  ')
    await user.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('angular')
  })

  it('shows clear button when there is text and clears input when clicked', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    
    // Type some text
    await user.type(input, 'test query')
    
    // Clear button should appear - find all buttons and get the one that's not "Search"
    const buttons = screen.getAllByRole('button')
    const clearButton = buttons.find(button => button.textContent !== 'Search')
    expect(clearButton).toBeInTheDocument()
    
    // Click clear button
    await user.click(clearButton)
    
    // Input should be empty
    expect(input.value).toBe('')
  })

  it('disables input and button when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />)
    
    const input = screen.getByPlaceholderText('Search repositories...')
    const searchButton = screen.getByRole('button', { name: 'Searching...' })
    
    expect(input).toBeDisabled()
    expect(searchButton).toBeDisabled()
  })

  it('shows "Searching..." text when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />)
    
    expect(screen.getByRole('button', { name: 'Searching...' })).toBeInTheDocument()
  })

  it('disables search button when input is empty', async () => {
    const user = userEvent.setup()
    render(<SearchBar onSearch={mockOnSearch} isLoading={false} />)
    
    const searchButton = screen.getByRole('button', { name: 'Search' })
    
    // Button should be disabled initially
    expect(searchButton).toBeDisabled()
    
    // Type something
    const input = screen.getByPlaceholderText('Search repositories...')
    await user.type(input, 'test')
    
    // Button should be enabled
    expect(searchButton).not.toBeDisabled()
    
    // Clear input
    await user.clear(input)
    
    // Button should be disabled again
    expect(searchButton).toBeDisabled()
  })
})
