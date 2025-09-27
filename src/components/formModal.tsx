import * as React from "react";
import { useEffect } from "react";

type SelectOption = {
  value: string | number;
  label: string;
};

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'checkbox' | string;
  required?: boolean;
  options?: SelectOption[];
};

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  fields: Field[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
};


export default function FormModal({ title, open, onClose, fields, initialValues = {}, onSubmit }: Props) {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => setValues(initialValues), [initialValues, open]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [open, onClose]);


  const handleChange = (name: string, v: unknown) => setValues(prev => ({ ...prev, [name]: v }));


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };


  if (!open) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-card rounded-lg shadow-lg w-full max-w-4xl mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={submit}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>


          <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
            {fields.map(f => (
              <div key={f.name} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{f.label}{f.required ? ' *' : ''}</label>


                {f.type === 'select' ? (
                    <select
                    value={String(values[f.name] ?? '')}
                    onChange={e => handleChange(f.name, e.target.value)}
                    className="border border-input bg-background text-foreground rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required={f.required}
                    >
                    <option value="">Select</option>
                    {f.options?.map((o: SelectOption) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                    </select>
                ) : f.type === 'checkbox' ? (
                  <label className="inline-flex items-center space-x-2">
                    <input type="checkbox" checked={!!values[f.name]} onChange={e => handleChange(f.name, e.target.checked)} />
                    <span className="text-sm">{f.label}</span>
                  </label>
                ) : (
                  <input
                    type={f.type ?? 'text'}
                    value={String(values[f.name] ?? '')}
                    onChange={e => handleChange(f.name, e.target.value)}
                    className="border border-input bg-background text-foreground rounded px-3 py-2 focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required={f.required}
                  />
                )}


              </div>
            ))}
          </div>


          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-muted text-muted-foreground hover:bg-muted/80">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}