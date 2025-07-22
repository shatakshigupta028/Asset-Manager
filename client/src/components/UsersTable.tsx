
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Plus, Edit, Trash, Calendar } from 'lucide-react';
import { fetchUsers, deleteUser } from '../lib/axios';
import { UserForm } from "./UserForm";

interface UsersTableProps {
  onAddAsset: () => void;
  onEditAsset: (user: any) => void;
}

export function UsersTable({ onAddAsset, onEditAsset }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch users');
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.room_no?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUserRole = userRoleFilter === 'all' || user.Role?.name === userRoleFilter;
    const matchesLocation = locationFilter === 'all' || user.location === locationFilter;
    return matchesSearch && matchesUserRole && matchesLocation;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Assigned':
        return <Badge className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'Maintenance':
        return <Badge className="bg-orange-100 text-orange-800">Maintenance</Badge>;
      case 'Retired':
        return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  
const handleDeleteClick = async (id: number) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  setLoading(true);
  setError(null);
  try {
    await deleteUser(id);
    setUsers(users.filter(user => user.id !== id));
  } catch (err) {
    setError("Failed to delete user");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="p-6 mt-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">All Users</CardTitle>
              <Button onClick={() => setIsUserFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Register New User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="powerUser">PowerUser</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Office A">Office A</SelectItem>
                  <SelectItem value="Office B">Office B</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
              <div></div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-gray-500 font-medium">
                  <TableHead className="font-semibold">User Id</TableHead>
                    <TableHead className="font-semibold">User Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Room No</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4}>Loading...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-red-500">{error}</TableCell>
                    </TableRow>
                  ) : paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>No users found.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>{user.id}</TableCell>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.Role?.name ? user.Role.name.charAt(0).toUpperCase() + user.Role.name.slice(1)
                         : ''}</TableCell>
                        <TableCell>{user.room_no}</TableCell>
                        <TableCell>{user.location}</TableCell>
                        <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                          {user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : ''}
                          </div>
                          </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditUser(user)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(user.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {isUserFormOpen && (
          <UserForm
            isOpen={isUserFormOpen}
            onClose={() => setIsUserFormOpen(false)}
          />
        )}
      </div>
    </main>
  );
}
