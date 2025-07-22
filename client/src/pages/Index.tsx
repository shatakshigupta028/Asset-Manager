
import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { AssetsTable } from '@/components/AssetsTable';
import { AssignmentsView } from '@/components/AssignmentsView';
import { ComplaintsView } from '@/components/ComplaintsView';
import { AssetForm } from '@/components/AssetForm';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar'
import { UsersTable } from '@/components/UsersTable';
import API from '../lib/axios';
import { useToast } from "@/hooks/use-toast";



export type ViewType = 'dashboard' | 'assets' | 'assignments' | 'users' | 'complaints';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isAssetFormOpen, setIsAssetFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  const { toast } = useToast(); 
  
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const res = await API.get('/assets');
    setAssets(res.data);
  };

  const handleDeleteAsset = async (id: number) => {
    await API.delete(`/assets/${id}`);
    loadAssets(); 
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'assets':
        return (
          <AssetsTable
          assets={assets}
            onAddAsset={() => {
              setEditingAsset(null);
              setIsAssetFormOpen(true);
            }}
            onEditAsset={(asset) => {
              setEditingAsset(asset);
              setIsAssetFormOpen(true);
            }}
            onDeleteAsset={handleDeleteAsset}
          />
        );
      case 'assignments':
        return <AssignmentsView />;
        case 'users':
          return <UsersTable 
            onAddAsset={() => {
              setEditingAsset(null);
              setIsAssetFormOpen(true);
            }}
            onEditAsset={(asset) => {
              setEditingAsset(asset);
              setIsAssetFormOpen(true);
            }}
          />;
      case 'complaints':
        return <ComplaintsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        {/* <main className="flex-1 p-6"> */}
        <main className="flex-1 flex flex-col">
            <Navbar /> 
          {renderContent()}
        </main>
        
        <AssetForm
          isOpen={isAssetFormOpen}
          onClose={() => {
            setIsAssetFormOpen(false);
            setEditingAsset(null);
          }}
          asset={editingAsset}
          onCreate={async (data) => {
            await API.post('/assets', data);
            loadAssets();
          }}
          onUpdate={async (id, data) => {
            await API.put(`/assets/${id}`, data);
            loadAssets();
          }}
          onDelete={async (id) => {
            await API.delete(`/assets/${id}`);
            loadAssets();            
          }}
          
        />
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Index;
