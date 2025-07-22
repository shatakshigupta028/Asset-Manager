import {ContactRound, LaptopMinimal, Users, Mail, Home } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'

interface AppSidebarProps {
  currentView: string
  onViewChange: (view: any) => void
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    view: 'dashboard',
  },
  {
    title: 'Assets',
    icon: LaptopMinimal,
    view: 'assets',
  },
  {
    title: 'Assignments',
    icon: ContactRound,
    view: 'assignments',
  },
  {
    title: 'Users',
    icon: Users,
    view: 'users',
  },
  {
    title: 'Complaints',
    icon: Mail,
    view: 'complaints',
  },
]

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <LaptopMinimal className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">Asset Manager</span>
        </div>
      </SidebarHeader>

       <div className="p-2 border-b border-gray-100">
        </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase text-xs font-semibold px-6">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.view)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      currentView === item.view
                        ? 'bg-blue-50 text-gray-700 border-l-4 border-gray-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
