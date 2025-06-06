import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Doctor {
  doctor_id: number;
  full_name: string;
  email: string;
  specialization: string;
  phone: string;
  is_active: boolean;
  role_id: number;
}

interface Role {
  role_id: number;
  role_name: string;
  description: string;
}

export const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    specialization: '',
    phone: '',
    role_id: ''
  });

  useEffect(() => {
    fetchDoctors();
    fetchRoles();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role_id) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    if (!editingDoctor && !formData.password) {
      toast({
        title: "Error",
        description: "Password is required when creating a new doctor",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingDoctor 
        ? `${API_BASE_URL}/api/doctors/${editingDoctor.doctor_id}`
        : `${API_BASE_URL}/api/doctors`;
      
      const method = editingDoctor ? 'PUT' : 'POST';
      const submitData = editingDoctor 
        ? { ...formData, password: undefined } // Don't send password on update unless specified
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Doctor ${editingDoctor ? 'updated' : 'created'} successfully`,
        });
        fetchDoctors();
        handleCloseDialog();
      } else {
        throw new Error('Failed to save doctor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save doctor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (doctorId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Doctor deleted successfully",
        });
        fetchDoctors();
      } else {
        throw new Error('Failed to delete doctor');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete doctor",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      full_name: doctor.full_name,
      email: doctor.email,
      password: '',
      specialization: doctor.specialization,
      phone: doctor.phone,
      role_id: doctor.role_id?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDoctor(null);
    setFormData({
      full_name: '',
      email: '',
      password: '',
      specialization: '',
      phone: '',
      role_id: ''
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Doctor Management</CardTitle>
          <CardDescription>Manage all doctors in the system</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required={!editingDoctor}
                  placeholder={editingDoctor ? "Leave blank to keep current password" : "Enter password"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_id">Role</Label>
                <Select value={formData.role_id} onValueChange={(value) => setFormData(prev => ({ ...prev, role_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingDoctor ? 'Update' : 'Create'} Doctor
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctors.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No doctors found.</p>
          ) : (
            doctors.map((doctor) => (
              <div key={doctor.doctor_id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{doctor.full_name}</span>
                    <Badge variant={doctor.is_active ? "default" : "secondary"}>
                      {doctor.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Email:</strong> {doctor.email}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {doctor.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(doctor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doctor.doctor_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
