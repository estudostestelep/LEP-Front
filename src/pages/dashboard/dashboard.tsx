import { useUser } from "../../context/userContext";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, <strong>{user?.userId}</strong></p>
      <p>Org ID: {user?.orgId}</p>
      <p>Proj ID: {user?.projId}</p>
    </div>
  );
}
