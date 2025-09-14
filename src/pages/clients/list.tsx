import { useEffect, useState } from "react";
import { clientService } from "../../api/clientService";
import { Link } from "react-router-dom";

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const response = await clientService.getAll();
    setClients(response.data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir?")) {
      await clientService.remove(id);
      loadClients();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Clientes</h1>
      <Link to="/clientes/novo" className="bg-blue-500 text-white px-3 py-1 rounded">Novo Cliente</Link>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.nome}</td>
              <td>{c.email}</td>
              <td>{c.telefone}</td>
              <td>
                <Link to={`/clientes/${c.id}`} className="text-blue-600 mr-2">Editar</Link>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
