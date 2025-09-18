// app/dashboard/admindashboard/manageuser/ManageUsersTable.jsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function ManageUsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);

  async function toggleRole(id, currentRole) {
    const newRole = currentRole === "admin" ? "user" : "admin";

    // Confirm before changing role
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change this user to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, make ${newRole}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/updateRole", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map(u => (u._id === id ? { ...u, role: newRole } : u)));

        Swal.fire({
          icon: "success",
          title: "Role Updated",
          text: `User is now a ${newRole}`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update role. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Try again later.",
      });
    }
  }

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
          <th className="border p-2">Role</th>
          <th className="border p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user._id}>
            <td className="border p-2">{user.name}</td>
            <td className="border p-2">{user.email}</td>
            <td className="border p-2">{user.role}</td>
            <td className="border p-2">
              <button
                onClick={() => toggleRole(user._id, user.role)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Make {user.role === "admin" ? "User" : "Admin"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
