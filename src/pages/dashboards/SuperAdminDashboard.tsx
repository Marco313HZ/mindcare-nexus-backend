
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { DoctorManagement } from '@/components/DoctorManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { Users, UserPlus, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

export const SuperAdminDashboard = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0
  });
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Form state for creating new super admin
  const [newAdminForm, setNewAdminForm] = useState({
    full_name: '',
    email: '',
    password_hash: '',
    phone: ''
  });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'patients', label: 'Patients' },
    { id: 'admins', label: 'Super Admins' }
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
    fetchUserDetails();
  }, [activeTab, user]);

  const fetchUserDetails = async () => {
    if (!user?.id || !token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/superadmin/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        
        // Update localStorage with complete user data
        const updatedUser = {
          ...user,
          full_name: data.full_name,
          email: data.email,
          profile_picture: data.profile_picture || ''
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch doctors count
      const doctorsResponse = await fetch(`${API_BASE_URL}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch patients count
      const patientsResponse = await fetch(`${API_BASE_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (doctorsResponse.ok && patientsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        const patientsData = await patientsResponse.json();
        
        setStats({
          totalDoctors: doctorsData.length,
          totalPatients: patientsData.length
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalDoctors: 0,
        totalPatients: 0
      });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingAdmin(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newAdminForm,
          userType: 'SuperAdmin'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create super admin');
      }

      toast({
        title: "Success",
        description: "Super admin created successfully!",
      });

      // Reset form and close add mode
      setNewAdminForm({
        full_name: '',
        email: '',
        password_hash: '',
        phone: ''
      });
      setIsAddingAdmin(false);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create super admin",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statsCards = [
    { title: 'Total Doctors', value: stats.totalDoctors.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Total Patients', value: stats.totalPatients.toString(), icon: UserPlus, color: 'text-green-600' }
  ];

  const getWelcomeMessage = () => {
    const displayName = userDetails?.full_name || user?.full_name;
    if (!displayName) return 'Welcome';
    
    const firstName = displayName.split(' ')[0];
    if (user?.role === 'SuperAdmin') {
      return `Welcome, ${firstName} Admin`;
    }
    return `Welcome, ${displayName}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-2">Manage your psychiatric center operations</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="mb-2"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stat.value === '0' ? 'No data found yet' : stat.value}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.totalDoctors > 0 || stats.totalPatients > 0 ? (
                    <>
                      {stats.totalDoctors > 0 && (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Doctor Management</p>
                            <p className="text-sm text-gray-600">{stats.totalDoctors} doctors registered in the system</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      )}
                      {stats.totalPatients > 0 && (
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">Patient Management</p>
                            <p className="text-sm text-gray-600">{stats.totalPatients} patients registered in the system</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No recent activity found yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && <DoctorManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && <PatientManagement />}

        {/* Super Admins Tab */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Super Admin Management</CardTitle>
                  <CardDescription>Manage super administrator accounts</CardDescription>
                </div>
                {!isAddingAdmin && (
                  <Button onClick={() => setIsAddingAdmin(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Super Admin
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isAddingAdmin ? (
                  <form onSubmit={handleCreateAdmin} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={newAdminForm.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newAdminForm.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_hash">Password</Label>
                      <Input
                        id="password_hash"
                        name="password_hash"
                        type="password"
                        value={newAdminForm.password_hash}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter password"
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={newAdminForm.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={isCreatingAdmin}
                      >
                        {isCreatingAdmin ? 'Creating...' : 'Create Super Admin'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setIsAddingAdmin(false);
                          setNewAdminForm({
                            full_name: '',
                            email: '',
                            password_hash: '',
                            phone: ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Click "Add Super Admin" to create a new administrator account</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
