import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { EmailVerificationDialog } from './EmailVerificationDialog';

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Role {
  role_id: number;
  role_name: string;
  description: string;
}

export const SignupDialog: React.FC<SignupDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'doctor', // always doctor
    specialization: '',
    role_id: '', // will be set to Doctor's role_id
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [showVerification, setShowVerification] = useState(false);
  const { signup, isLoading } = useAuth();

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  useEffect(() => {
    // Set role_id to the first role with name 'Doctor' (case-insensitive) when roles are loaded
    const doctorRole = roles.find(role => role.role_name.toLowerCase() === 'doctor');
    if (doctorRole && formData.role_id !== doctorRole.role_id.toString()) {
      setFormData(prev => ({ ...prev, role_id: doctorRole.role_id.toString() }));
    }
  }, [roles]);

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
    if (!formData.full_name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    if (!formData.role_id) {
      toast({
        title: "Error",
        description: "Doctor role not found. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    try {
      await signup(formData, 'doctor');
      toast({
        title: "Signup successful",
        description: "Please check your email for a verification code",
      });
      setShowVerification(true);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      phone: '',
      userType: 'doctor', // reset to default
      specialization: '',
      role_id: '', // reset role_id
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    resetForm();
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    onOpenChange(false);
    resetForm();
  };

  return (
    <>
      <Dialog open={open && !showVerification} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Sign Up</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type is always Doctor, so hide the dropdown */}
            {/* <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={formData.userType} onValueChange={(value) => handleChange('userType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
            
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            {/* Role is always Doctor, so hide the dropdown and show as read-only */}
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Doctor" readOnly disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <EmailVerificationDialog
        open={showVerification}
        onOpenChange={setShowVerification}
        email={formData.email}
        userType={formData.userType}
        onVerificationComplete={handleVerificationComplete}
      />
    </>
  );
};
