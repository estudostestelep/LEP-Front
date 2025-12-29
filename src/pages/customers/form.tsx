import { useState } from "react";
import { userService, User, CreateUserRequest } from "@/api/userService";
import { useCurrentTenant } from '@/hooks/useCurrentTenant';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  initialData?: User;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  password?: string;
  permissions: string[];
}

export default function UserForm({ initialData, onSuccess, onCancel }: Props) {
  const { organization_id, project_id } = useCurrentTenant();
  const [form, setForm] = useState<FormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "",
    password: "",
    permissions: initialData?.permissions || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organization_id || !project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    if (initialData?.id) {
      await userService.update(initialData.id, form);
    } else {
      const createData: CreateUserRequest = {
        name: form.name,
        email: form.email,
        password: form.password || "123456", // Senha padrão
        permissions: form.permissions
      };
      await userService.create(createData);
    }
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-4 rounded shadow space-y-4"
    >
      <Input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <Input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <Input
        type="text"
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Role"
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="default"
        >
          {initialData?.id ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
