import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Monitor, Edit, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import API from '@/lib/axios.ts';


interface AssetsTableProps {
  onAddAsset: () => void;
  onEditAsset: (asset: any) => void;
  onDeleteAsset: (id: number) => void
}

export function AssetsTable({assets, onAddAsset, onEditAsset, onDeleteAsset }: AssetsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
// const [assets, setAssets] = useState<any[]>([]);


  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase())||
      asset.room?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || asset.locationAsset === locationFilter;
  
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });
  

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

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

  return (
    <main className="p-6 mt-2">
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">All Assets</CardTitle>
            <Button onClick={onAddAsset} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assets..."
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
              </SelectContent>
              </Select>
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
          {/* Assets Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 text-gray-600 font-medium">
                  <TableHead className="font-semibold">Asset Name</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Registration Number</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Room</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {asset.name}
                      </div>
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell className="font-mono text-sm pl-8">{asset.registrationNo}</TableCell>
                    <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    <TableCell>{asset.room}</TableCell>
                    <TableCell>{asset.locationAsset}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditAsset(asset)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteAsset(asset.id)}
                        className="h-8 w-8 p-0 ext-red-600 hover:text-red-800"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
