
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import API from '@/lib/axios.ts';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: any;
  onCreate: (formData: any) => Promise<void>;
  onUpdate: (id: number, formData: any) => Promise<void>;
  onDelete : (id: number) => Promise<void>;
}

export function AssetForm({ isOpen, onClose, asset, onCreate, onUpdate, onDelete }: AssetFormProps) {
  const { toast } = useToast();
  const [assets, setAssets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serialNumber: '',
    status: 'Active',
    assignedUser: '',
    locationAsset: 'Warehouse',
    room: '100',
    purchaseDate: '',
    warrantyDate: '',
    warrantyProvider: '',
    supportContact: '',
    specifications: {
      ram: '',
      processor: '',
      storage: '',
    },
    notes: '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        type: asset.type || '',
        serialNumber: asset.serialNumber || '',
        status: asset.status || 'Active',
        assignedUser: asset.assignedUser || '',
        locationAsset: asset.locationAsset || 'Warehouse',
        room: asset.room || '100',
        purchaseDate: asset.purchaseDate || '',
        warrantyDate: asset.warrantyDate || '',
        warrantyProvider: asset.warrantyProvider || '',
        supportContact: asset.supportContact || '',
        specifications: {
          ram: asset.specifications?.ram || '',
          processor: asset.specifications?.processor || '',
          storage: asset.specifications?.storage || '',
        },
        notes: asset.notes || '',
      });
    } else {
      setFormData({
        name: '',
        type: '',
        serialNumber: '',
        status: 'Active',
        assignedUser: '',
        locationAsset: 'Warehouse',
        purchaseDate: '',
        warrantyDate: '',
        warrantyProvider: '',
        room: '100',
        supportContact: '',
        specifications: {
          ram: '',
          processor: '',
          storage: '',
        },
        notes: '',
      });
    }
  }, [asset]);

  const fetchAssets = async () => {
    try {
      const response = await API.get('/assets');
      setAssets(response.data); 
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    }
  };

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  
  const payload = {
    name: formData.name,
    type: formData.type,
    serial_no: formData.serialNumber,
    status: formData.status,
    location_asset: formData.locationAsset,
    room: formData.room,
    notes: formData.notes,
    purchase_date: formData.purchaseDate,
    warranty_expiry: formData.warrantyDate,
    warranty_provider: formData.warrantyProvider,
    support_contact: formData.supportContact,
    processor: formData.specifications.processor,
    ram: formData.specifications.ram,
    storage: formData.specifications.storage,
  };
  try {
    if (asset) {
      console.log('Update payload:', payload);
      await onUpdate(asset.id, payload);
      toast({ title: 'Asset updated successfully.' });
    }  else{
      await onCreate(payload);
      toast({ title: 'Asset created successfully.' });
    }
    onClose();
  } catch (error: any) {
    toast({
      title: 'Error saving asset',
      description: error?.response?.data?.message || 'Server error',
      variant: 'destructive',
    });
  }
};

const handleDelete = async () => {
  if (!asset) return;
  try {
    await onDelete(asset.id);
    toast({ title: 'Asset deleted successfully.' });
    onClose();
  } catch (error: any) {
    toast({
      title: 'Error deleting asset',
      description: error?.response?.data?.message || 'Server error',
      variant: 'destructive',
    });
  }
};

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('specifications.')) {
      const specField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="eg..Laptop, PC, etc"
              />
            </div>
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serialNumber">Serial Number *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                required
                placeholder="eg.,SN0001"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => handleChange('room', e.target.value)}
                placeholder="Room number"
              />
            </div>
            <div>
            <Label htmlFor="locationAsset">Location</Label>
              <Select value={formData.locationAsset} onValueChange={(value) => handleChange('locationAsset', value)}>
              <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office A">Office A</SelectItem>
                  <SelectItem value="Office B">Office B</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedUser">Assigned User</Label>
              <Input
                id="assignedUser"
                value={formData.assignedUser}
                onChange={(e) => handleChange('assignedUser', e.target.value)}
                placeholder="Username or email"
              />
            </div>
             </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="warrantyDate">Warranty Expiration</Label>
              <Input
                id="warrantyDate"
                type="date"
                value={formData.warrantyDate}
                onChange={(e) => handleChange('warrantyDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="warrantyProvider">Warranty Provider</Label>
              <Input
                id="warrantyProvider"
                type="text"
                value={formData.warrantyProvider}
                onChange={(e) => handleChange('warrantyProvider', e.target.value)}
                placeholder="e.g., Dell, HP, Lenovo, etc."
              />
            </div>
            <div>
              <Label htmlFor="supportContact">Support Contact *</Label>
              <Input
                id="supportContact"
                type="text"
                value={formData.supportContact}
                onChange={(e) => handleChange('supportContact', e.target.value)}
                required
                placeholder="e.g., 1234567890"
                />
            </div>

          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Specifications</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  value={formData.specifications.ram}
                  onChange={(e) => handleChange('specifications.ram', e.target.value)}
                  placeholder="e.g., 16GB DDR4"
                />
              </div>
              <div>
                <Label htmlFor="processor">Processor</Label>
                <Input
                  id="processor"
                  value={formData.specifications.processor}
                  onChange={(e) => handleChange('specifications.processor', e.target.value)}
                  placeholder="e.g., Intel i7-12700H"
                />
              </div>
              <div>
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  value={formData.specifications.storage}
                  onChange={(e) => handleChange('specifications.storage', e.target.value)}
                  placeholder="e.g., 512GB SSD"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes or comments"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center pt-4">
  {asset && (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
    >
      Delete Asset
    </Button>
  )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {asset ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
