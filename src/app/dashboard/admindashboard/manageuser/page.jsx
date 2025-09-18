// app/dashboard/admindashboard/manageuser/page.jsx
 
import { getServerSession } from "next-auth";
import ManageUsersTable from "./ManageUsersTable"; // client component
import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";

export default async function ManageUsersPage() {
  const session = await getServerSession(authOptions);

  // ✅ Restrict access to admin only
  if (!session || session.user.role !== "admin") {
    return <div className="p-6 text-red-500">Access Denied</div>;
  }

  // ✅ Fetch all users (SSR)
  const userCollection = await dbConnect(collectionNamesObj.userCollection);
  const users = await userCollection
    .find({}, { projection: { password: 0 } }) // don’t send passwords
    .sort({ createdAt: -1 })
    .toArray();

  const serializedUsers = users.map(u => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <ManageUsersTable initialUsers={serializedUsers} />
    </div>
  );
}
