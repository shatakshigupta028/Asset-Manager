import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import GlobalSearch from "@/components/search"
import { fetchCurrentUser } from "../lib/axios"
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



export default function Navbar() {
  const [dateTime, setDateTime] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login", { replace: true }); 
  };

  useEffect(() => {
    fetchCurrentUser()
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setDateTime(now.toLocaleString("en-IN", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        day: "numeric",
        month: "short"
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="w-full bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm"
    style={{ backgroundColor: 'hsl(0 0% 100%)' }}>
      {/* Left Section */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 lg:hidden"
        onClick={() => setSidebarOpen(prev => !prev)}
       >
       <Menu className="w-6 h-6" />
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4">
        <div className="text-sm text-gray-700">Welcome, <span className="font-medium">{user ? user.full_name : "User"}</span></div>
        <div className="text-xs text-gray-500">{user ? (user.Role?.name ? user.Role.name.charAt(0).toUpperCase() + user.Role.name.slice(1)
                         : '') : ""}</div>
        <div className="text-xs text-gray-400 hidden sm:block">{dateTime}</div>
        
      </div>

      {/* Center - Global Search */}
      <div className="hidden md:block w-1/3">
        <GlobalSearch />
      </div>

      {/* Right -Avatar */}
      <div className="flex items-center gap-4">
      
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || ""} alt="User" />
              <AvatarFallback>{user ? user.full_name.slice(0, 2).toUpperCase() : "US"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
