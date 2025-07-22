import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Edit, Search, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteComplaint, fetchComplaints } from '../lib/axios';
import API from '../lib/axios';

const statusColorMap: Record<string, string> = {
  Open: 'bg-red-100 text-red-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Resolved: 'bg-green-100 text-green-700',
};

export function ComplaintsView() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetchComplaints()
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch complaints');
        setLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
    complaint.userId.toString().includes(searchTerm)||
      complaint.registration_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);


  const handleDeleteClick = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    setLoading(true);
    setError(null);
    try {
      await deleteComplaint(id);
      setComplaints(complaints.filter(complaint => complaint.id !== id));
    } catch (err) {
      setError("Failed to delete complaint");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="p-6 mt-2">
      <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2 mt-2">
            <CardTitle className="text-xl font-semibold">Asset Complaints</CardTitle>
          </div>
        </CardHeader>
        <CardContent>

{/* 🔍 Filters Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                 <SelectItem value="Medium">Medium</SelectItem>
                 <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
      {/* Complaints Table */}
      <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-gray-500 font-medium">
                    <TableHead className="font-semibold">Registration No.</TableHead>
                    <TableHead className="font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">User Role</TableHead>
                    <TableHead className="font-semibold">Issue</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedComplaints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>No complaints found.</TableCell>
                    </TableRow>
                  ) : (
                    paginatedComplaints.map((complaint) => (
                      <TableRow key={complaint.id} className="hover:bg-gray-50">
                        <TableCell>{complaint.registration_no}</TableCell>
                        <TableCell>{complaint.userId}</TableCell>
                        <TableCell>{complaint.user_role || 'N/A'}</TableCell>
                        <TableCell>{complaint.title}</TableCell>
                        <TableCell>
                          <Badge className={statusColorMap[complaint.status]}>
                            {complaint.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{complaint.priority}</TableCell>
                        <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                          {complaint.createdAt ? new Date(complaint.createdAt).toISOString().slice(0, 10) : ''}
                          </div>
                          </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditComplaint(complaint)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of {filteredComplaints.length} results
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
      </div>
    </main>
  );
}
