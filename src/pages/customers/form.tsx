import { useState } from "react";
import { userService, User, CreateUserRequest } from "@/api/userService";
import { useAuth } from "@/context/authContext";

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
  const { user } = useAuth();
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

    if (!user?.organization_id || !user?.project_id) {
      alert("Erro: dados de organização não encontrados");
      return;
    }

    if (initialData?.id) {
      await userService.update(initialData.id, form);
    } else {
      const createData: CreateUserRequest = {
        organization_id: user.organization_id,
        project_id: user.project_id,
        name: form.name,
        email: form.email,
        password: form.password || "123456", // Senha padrão
        role: form.role,
        permissions: form.permissions
      };
      await userService.create(createData);
    }
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="role"
        value={form.role}
        onChange={handleChange}
        placeholder="Role"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {initialData?.id ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
