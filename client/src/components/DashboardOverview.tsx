
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, TrendingUp, Calendar, AlertTriangle, CheckCircle, Users, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import API from '@/lib/axios.ts';

export function DashboardOverview() {
  const [assets, setAssets] = useState<any[]>([]);

const fetchAssets = async () => {
  // 
  try {
    console.log("➡ Fetching from /assets...");
    const res = await API.get('/assets/');
    console.log("✅ Response:", res.data);
    setAssets(res.data);
  } catch (err: any) {
    console.error("❌ Axios error:", err?.response?.data || err.message);
  }
};

useEffect(() => {
  fetchAssets();
}, []);


  const activeAssets = assets.filter(asset => asset.status === 'Active').length;
  const assignedAssets = assets.filter(asset => asset.status === 'Assigned').length;
  const maintenanceAssets = assets.filter(asset => asset.status === 'Maintenance').length;
  const retiredAssets = assets.filter(asset => asset.status === 'Retired').length;

  const recentAssets = assets.slice(0, 5);
  const recentAssignments = assets.filter(asset => asset.assignedUser).slice(0, 5);


  const statusCards = [
    {
      title: 'Active Assets',
      value: activeAssets,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Assigned Assets',
      value: assignedAssets,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'In Maintenance',
      value: maintenanceAssets,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Retired Assets',
      value: retiredAssets,
      icon: Monitor,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  // Process data for charts
  const assetsByType = assets.reduce((acc: any, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) +1;
    return acc;
  }, {});

  const assetsByStatus = assets.reduce((acc: any, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {});

  const typeChartData = Object.entries(assetsByType).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const statusChartData = Object.entries(assetsByStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Mock monthly data for trend chart
  const monthlyData = [
    { month: 'Jan', active: 45, assigned: 38, maintenance: 5 },
    { month: 'Feb', active: 47, assigned: 40, maintenance: 3 },
    { month: 'Mar', active: 48, assigned: 42, maintenance: 4 },
    { month: 'Apr', active: 50, assigned: 45, maintenance: 2 },
    { month: 'May', active: 52, assigned: 47, maintenance: 3 },
    { month: 'Jun', active: 54, assigned: 48, maintenance: 4 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate key metrics
  const totalAssets = assets.length;
  const utilizationRate = Math.round((assets.filter(a => a.status === 'Assigned').length / totalAssets) * 100);
  const maintenanceRate = Math.round((assets.filter(a => a.status === 'Maintenance').length / totalAssets) * 100);
  const avgAge = 2.3; // Mock average age in years

  return (
      <main className="p-6 mt-2">
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-3xl font-bold text-gray-900">{totalAssets}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                <p className="text-3xl font-bold text-gray-900">{utilizationRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance Rate</p>
                <p className="text-3xl font-bold text-gray-900">{maintenanceRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-50">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Age</p>
                <p className="text-3xl font-bold text-gray-900">{avgAge}y</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets by Type */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assets by Type</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Assets by Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Assets by Status</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Asset Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Asset Status Trends</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} name="Active" />
              <Line type="monotone" dataKey="assigned" stroke="#3B82F6" strokeWidth={2} name="Assigned" />
              <Line type="monotone" dataKey="maintenance" stroke="#F59E0B" strokeWidth={2} name="Maintenance" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Summary by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Office A', 'Office B', 'Warehouse'].map((location) => {
              const locationAssets = assets.filter(asset => asset.locationAsset === location);
              const active = locationAssets.filter(a => a.status === 'Active').length;
              const assigned = locationAssets.filter(a => a.status === 'Assigned').length;
              
              return (
                <div key={location} className="p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">{location}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Assets:</span>
                      <Badge variant="outline">{locationAssets.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active:</span>
                      <Badge className="bg-green-100 text-green-800">{active}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned:</span>
                      <Badge className="bg-blue-100 text-blue-800">{assigned}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
    </main>
  );
}

