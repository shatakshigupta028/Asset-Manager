import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, UserPlus, UserMinus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import API from '../lib/axios'; 

export function AssignmentsView() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAssignments = async () => {
    try {
      const res = await API.get('/assignments'); 
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      toast({ title: "Failed", description: "Could not load assignments" });
    } finally {
      setLoading(false);
    }
  };

  fetchAssignments();
}, []);

  const assignedAssets = assignments;
  const roleMap = {
    admin: 1,
    powerUser: 2,
    user: 3,
  };

  const filteredAssets = assignedAssets.filter(asset => {
    const matchesSearch =
      asset.userLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetType.toLowerCase().includes(searchTerm.toLowerCase())||
      asset.userRoom?.toString().toLowerCase().includes(searchTerm.toLowerCase())||
      asset.registrationNo?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || asset.assetType === typeFilter;
    const matchesLocation = locationFilter === 'all' || asset.userLocation === locationFilter;
    const matchesUserRole = userRoleFilter === 'all' || asset.userRole === roleMap[userRoleFilter];

    return matchesSearch && matchesType && matchesLocation && matchesUserRole;
  });

   // Pagination logic
   const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  const availableAssets = assignedAssets.filter(asset =>
    asset.assetStatus === 'Active' && !asset.assignedUser
  );

  const handleAssignAsset = () => {
    if (!selectedAsset || !selectedUser) return;

    toast({
      title: 'Asset Assigned',
      description: `Asset has been successfully assigned to ${selectedUser}.`,
    });

    setIsAssignDialogOpen(false);
    setSelectedAsset('');
    setSelectedUser('');
  };

  const handleReturnAsset = (assetId: string, assetName: string) => {
    toast({
      title: 'Asset Returned',
      description: `${assetName} has been returned successfully.`,
    });
  };

  return (
    <main className="p-6 mt-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold">Asset Assignments</CardTitle>
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Assign Asset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Asset to User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="asset-select">Select Asset</Label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an available asset" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAssets.map((asset) => (
                            <SelectItem key={asset.id} value={String(asset.id)}>
                              {asset.name} - {asset.type} ({asset.serialNumber})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="user-select">Select User</Label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a user" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignments.map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.userName} - {user.userLocation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAssignAsset}
                        disabled={!selectedAsset || !selectedUser}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Assign Asset
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>

            {/* 🔍 Filters Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="relative col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Display">Display</SelectItem>
                    <SelectItem value="PC">PC</SelectItem>
                     <SelectItem value="Printer">Printer</SelectItem>
                    <SelectItem value="Router">Router</SelectItem>
                     <SelectItem value="Switch">Switch</SelectItem>
                    <SelectItem value="Server">Server</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
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
            </div>

            {/* 📋 Assignments Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 text-gray-500 font-medium">
                    <TableHead className="font-semibold">Registration No.</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Assigned User</TableHead>
                    <TableHead className="font-semibold">Room No.</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Assigned Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{assignment.registrationNo}</TableCell>
                      <TableCell>{assignment.assetType}</TableCell>
                      <TableCell className="font-mono text-sm">{assignment.userName}</TableCell>
                      <TableCell>{assignment.userRoom}</TableCell>
                      <TableCell>{assignment.userLocation}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {assignment.createdAt ? new Date(assignment.createdAt).toISOString().slice(0, 10) : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturnAsset(assignment.id, assignment.userName)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Return
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserMinus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No assigned assets found.</p>
              </div>
            )}
           {/* Pagination */}
           <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAssets.length)} of {filteredAssets.length} results
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
