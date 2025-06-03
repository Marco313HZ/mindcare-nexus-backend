
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResponse = await login(email, password);
      
      if (loginResponse.verified) {
        // Route based on user role
        const role = loginResponse.user.role;
        console.log('Routing user with role:', role);
        
        let dashboardRoute;
        
        // Set dashboard route based on role (case-insensitive)
        switch (role.toLowerCase()) {
          case 'superadmin':
            dashboardRoute = '/super-admin';
            break;
          case 'doctor':
            dashboardRoute = '/doctor';
            break;
          case 'patient':
            dashboardRoute = '/patient';
            break;
          default:
            console.warn('Unknown role:', role, 'redirecting to home');
            dashboardRoute = '/';
        }
        
        console.log('Navigating to:', dashboardRoute);
        
        // Close dialog and clear form
        onOpenChange(false);
        setEmail('');
        setPassword('');
        
        // Show success message
        toast({
          title: "Login successful",
          description: `Welcome back! Redirecting to ${role} dashboard...`,
        });

        // Navigate to role-specific dashboard
        navigate(dashboardRoute);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
