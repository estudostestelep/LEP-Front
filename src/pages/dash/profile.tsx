import { useUser } from "../../context/userContext";

export default function Profile() {
  const { user } = useUser();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
