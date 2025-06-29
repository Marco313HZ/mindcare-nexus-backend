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

  // Form state for creating new super admin
  const [newAdminForm, setNewAdminForm] = useState({
    full_name: '',
    email: '',
    password_hash: '',
    phone: '',
    role_id: 1
  });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'patients', label: 'Patients' },
    { id: 'create-admin', label: 'Create Super Admin' }
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab, user]);

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
      console.log('Creating super admin with payload:', newAdminForm);
      
      const response = await fetch(`${API_BASE_URL}/api/super-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAdminForm)
      });

      const data = await response.json();
      console.log('Create admin response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create super admin');
      }

      toast({
        title: "Success",
        description: "Super admin created successfully!",
      });

      // Reset form
      setNewAdminForm({
        full_name: '',
        email: '',
        password_hash: '',
        phone: '',
        role_id: 1
      });

    } catch (error: any) {
      console.error('Error creating admin:', error);
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
    const displayName = user?.full_name;
    if (!displayName) return 'Welcome';
    
    const firstName = displayName.split(' ')[0];
    if (user?.role === 'SuperAdmin') {
      return `Welcome, ${firstName}`;
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

        {/* Create Super Admin Tab */}
        {activeTab === 'create-admin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Super Admin</h2>
                <p className="text-gray-600 mt-1">Add a new super administrator to the system</p>
              </div>
             
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Super Admin Information</span>
                </CardTitle>
                <CardDescription>
                  Fill in the details below to create a new super administrator account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdmin} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={newAdminForm.full_name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter full name"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newAdminForm.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email address"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_hash" className="text-sm font-medium text-gray-700">
                        Password *
                      </Label>
                      <Input
                        id="password_hash"
                        name="password_hash"
                        type="password"
                        value={newAdminForm.password_hash}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter password"
                        minLength={6}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={newAdminForm.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setNewAdminForm({
                        full_name: '',
                        email: '',
                        password_hash: '',
                        phone: '',
                        role_id: 1
                      })}
                    >
                      Clear Form
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isCreatingAdmin}
                      className="min-w-[120px]"
                    >
                      {isCreatingAdmin ? 'Creating...' : 'Create Admin'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
