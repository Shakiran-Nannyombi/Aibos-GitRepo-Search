import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '../../components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    const customMessage = 'Fetching repositories...'
    render(<LoadingSpinner message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('contains loading spinner icon', () => {
    render(<LoadingSpinner />)
    
    // Check for the spinner container
    const spinnerContainer = screen.getByText('Loading...').closest('div')
    expect(spinnerContainer).toBeInTheDocument()
    
    // The Loader2 icon should have animate-spin class
    const spinner = spinnerContainer.querySelector('svg')
    expect(spinner).toHaveClass('animate-spin')
  })

  it('has proper accessibility structure', () => {
    render(<LoadingSpinner message="Processing..." />)
    
    const container = screen.getByText('Processing...').closest('div')
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
  })
})
