import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import FormModal from '@/components/formModal'

// Mock the specific form components
const MockForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => (
  <div>
    <h2>Mock Form</h2>
    <button onClick={onSuccess}>Save</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
)

describe('FormModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    FormComponent: MockForm
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(<FormModal {...defaultProps} />)

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Mock Form')).toBeInTheDocument()
  })

  it('does not render modal when closed', () => {
    render(<FormModal {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Mock Form')).not.toBeInTheDocument()
  })

  it('displays correct title', () => {
    render(<FormModal {...defaultProps} title="Custom Title" />)

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
  })

  it('passes initialData to form component', () => {
    const initialData = { id: '123', name: 'Test' }
    const FormWithData = ({ initialData: data }: { initialData?: any }) => (
      <div>Form with data: {data?.name}</div>
    )

    render(
      <FormModal
        {...defaultProps}
        FormComponent={FormWithData}
        initialData={initialData}
      />
    )

    expect(screen.getByText('Form with data: Test')).toBeInTheDocument()
  })

  it('calls onClose when form succeeds', async () => {
    const onClose = vi.fn()
    render(<FormModal {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onClose when form is cancelled', async () => {
    const onClose = vi.fn()
    render(<FormModal {...defaultProps} onClose={onClose} />)

    fireEvent.click(screen.getByText('Cancel'))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onClose when clicking backdrop', async () => {
    const onClose = vi.fn()
    render(<FormModal {...defaultProps} onClose={onClose} />)

    // Click on the backdrop (the modal overlay)
    const backdrop = screen.getByRole('dialog').parentElement
    if (backdrop) {
      fireEvent.click(backdrop)
    }

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('calls onClose when pressing Escape key', async () => {
    const onClose = vi.fn()
    render(<FormModal {...defaultProps} onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('has proper accessibility attributes', () => {
    render(<FormModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-labelledby')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('focuses the modal when opened', () => {
    render(<FormModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(document.activeElement).toBe(dialog)
  })

  it('traps focus within modal', () => {
    render(<FormModal {...defaultProps} />)

    const saveButton = screen.getByText('Save')
    const cancelButton = screen.getByText('Cancel')

    // Tab should cycle through focusable elements
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    expect(document.activeElement).toBe(saveButton)

    fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
    expect(document.activeElement).toBe(cancelButton)
  })

  it('renders with different form components', () => {
    const AnotherForm = () => <div>Another Form Component</div>

    render(<FormModal {...defaultProps} FormComponent={AnotherForm} />)

    expect(screen.getByText('Another Form Component')).toBeInTheDocument()
    expect(screen.queryByText('Mock Form')).not.toBeInTheDocument()
  })
})