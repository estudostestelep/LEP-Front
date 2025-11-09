import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input />)

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" />)

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with value', () => {
    render(<Input value="test value" readOnly />)

    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed')
  })

  it('renders different input types', () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')

    rerender(<Input type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    const passwordInput = screen.getByDisplayValue('')
    expect(passwordInput).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)

    expect(screen.getByRole('textbox')).toHaveClass('custom-input')
  })

  it('has correct default styling', () => {
    render(<Input />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('flex')
    expect(input).toHaveClass('h-9')
    expect(input).toHaveClass('w-full')
    expect(input).toHaveClass('rounded-md')
    expect(input).toHaveClass('border')
    expect(input).toHaveClass('bg-card')
  })

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)

    const input = screen.getByRole('textbox')

    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} />)

    expect(ref).toHaveBeenCalled()
  })
})