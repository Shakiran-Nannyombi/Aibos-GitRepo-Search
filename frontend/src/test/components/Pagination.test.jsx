import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '../../components/Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('renders current page and total pages correctly', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        isLoading={false} 
      />
    )
    
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Visible in first 5
  })

  it('calls onPageChange when a page number is clicked', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        isLoading={false} 
      />
    )
    
    fireEvent.click(screen.getByText('2'))
    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        isLoading={false} 
      />
    )
    
    // Find ChevronLeft button (it's the first button)
    const prevButton = screen.getAllByRole('button')[0]
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={10} 
        totalPages={10} 
        onPageChange={mockOnPageChange} 
        isLoading={false} 
      />
    )
    
    // Find ChevronRight button (it's the last button)
    const buttons = screen.getAllByRole('button')
    const nextButton = buttons[buttons.length - 1]
    expect(nextButton).toBeDisabled()
  })

  it('renders ellipsis for large page counts', () => {
    render(
      <Pagination 
        currentPage={5} 
        totalPages={20} 
        onPageChange={mockOnPageChange} 
        isLoading={false} 
      />
    )
    
    expect(screen.getAllByText('...')).toHaveLength(2)
  })
})
