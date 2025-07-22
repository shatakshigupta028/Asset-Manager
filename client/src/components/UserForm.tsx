import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";


export function UserForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "",
    designation: "",
    dob: "",
    aadhar: "",
    pan: "",
    room_no: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/users/register", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast({ title: "User Registered Successfully" });
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to register user" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
          <Input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required />
          <Input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />
          <Input name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
          <Input name="dob" placeholder="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
          <Input name="aadhar" placeholder="Aadhar Number" value={formData.aadhar} onChange={handleChange} />
          <Input name="pan" placeholder="PAN Number" value={formData.pan} onChange={handleChange} />
          <Input name="room_no" placeholder="Room No." value={formData.room_no} onChange={handleChange} />
          <Select onValueChange={(val) => setFormData({ ...formData, role: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Power User">Power User</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
