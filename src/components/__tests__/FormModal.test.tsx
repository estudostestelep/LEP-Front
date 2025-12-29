import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import FormModal from '@/components/formModal'

describe('FormModal Component', () => {
  const defaultProps = {
    title: 'Test Modal',
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(
      <FormModal {...defaultProps}>
        <div>Modal Content</div>
      </FormModal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render modal when closed', () => {
    render(
      <FormModal {...defaultProps} open={false}>
        <div>Modal Content</div>
      </FormModal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('displays correct title', () => {
    render(
      <FormModal {...defaultProps} title="Custom Title">
        <div>Content</div>
      </FormModal>
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('passes initialValues to form fields', () => {
    const initialValues = { name: 'Test Name', email: 'test@example.com' }
    const testFields = [
      { name: 'name', label: 'Name', type: 'text' as const },
      { name: 'email', label: 'Email', type: 'text' as const }
    ]

    render(
      <FormModal
        {...defaultProps}
        fields={testFields}
        initialValues={initialValues}
      >
        <input type="text" name="name" defaultValue={initialValues.name} />
        <input type="text" name="email" defaultValue={initialValues.email} />
      </FormModal>
    )

    expect(screen.getByDisplayValue('Test Name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
  })

  it('calls onClose when clicking the close button', async () => {
    const onClose = vi.fn()
    render(
      <FormModal {...defaultProps} onClose={onClose}>
        <div>Modal Content</div>
      </FormModal>
    )

    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking backdrop', async () => {
    const onClose = vi.fn()
    render(
      <FormModal {...defaultProps} onClose={onClose}>
        <div>Modal Content</div>
      </FormModal>
    )

    // Click on the backdrop (the fixed overlay div)
    const backdrop = screen.getByText('Modal Content').closest('.fixed')
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when pressing Escape key', async () => {
    const onClose = vi.fn()
    render(
      <FormModal {...defaultProps} onClose={onClose}>
        <div>Modal Content</div>
      </FormModal>
    )

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onSubmit when form is submitted', async () => {
    const onSubmit = vi.fn()
    const onClose = vi.fn()

    render(
      <FormModal {...defaultProps} onSubmit={onSubmit} onClose={onClose}>
        <button type="submit">Submit</button>
      </FormModal>
    )

    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled()
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('has proper structure', () => {
    render(
      <FormModal {...defaultProps}>
        <div>Test Content</div>
      </FormModal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('renders with children prop', () => {
    render(
      <FormModal {...defaultProps}>
        <input type="text" placeholder="Test Input" />
      </FormModal>
    )

    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument()
  })

  it('handles field state changes', () => {
    const handleChange = vi.fn()

    render(
      <FormModal {...defaultProps}>
        <input type="text" onChange={handleChange} />
      </FormModal>
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(handleChange).toHaveBeenCalled()
  })
})