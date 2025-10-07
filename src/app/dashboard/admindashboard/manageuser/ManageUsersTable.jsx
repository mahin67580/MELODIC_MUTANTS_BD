// app/dashboard/admindashboard/manageuser/ManageUsersTable.jsx
"use client";

import { useState, useMemo } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageUsersTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter users based on search term and role filter
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || roleFilter !== "all") && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredUsers.length} of {users.length} users
        {(searchTerm || roleFilter !== "all") && " (filtered)"}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className={"bg-amber-300"}>
            <TableRow>
              <TableHead className="text-center w-12">#</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell className="text-center text-sm text-gray-500">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center font-medium">
                  {user.name}
                </TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className={user.role === "admin" ? "bg-blue-500" : ""}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => toggleRole(user._id, user.role)}
                    variant={user.role === "admin" ? "outline" : "default"}
                    size="sm"
                    className={
                      user.role === "admin" 
                        ? "border-blue-500 text-blue-500 hover:bg-blue-50" 
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  {users.length === 0 ? "No users found." : "No users match your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {filteredUsers.map((user, index) => (
          <Card key={user._id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                    {index + 1}
                  </div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                </div>
                <Badge 
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={user.role === "admin" ? "bg-blue-500" : ""}
                >
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <div className="text-sm text-gray-600">
                <div className="font-medium">Email:</div>
                <div className="truncate">{user.email}</div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => toggleRole(user._id, user.role)}
                  variant={user.role === "admin" ? "outline" : "default"}
                  size="sm"
                  className={
                    user.role === "admin" 
                      ? "border-blue-500 text-blue-500 hover:bg-blue-50" 
                      : "bg-blue-500 hover:bg-blue-600"
                  }
                >
                  Make {user.role === "admin" ? "User" : "Admin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="py-6">
              <div className="text-center text-gray-500">
                {users.length === 0 ? "No users found." : "No users match your search criteria."}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}