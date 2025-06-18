
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { AppointmentManagement } from '@/components/AppointmentManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { PatientDetailsModal } from '@/components/PatientDetailsModal';
import { Users, Calendar, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';

interface Patient {
  patient_id: number;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  is_active: boolean;
}

interface Appointment {
  appointment_id: number;
  patient_id: number;
  patient_name?: string;
  appointment_date: string;
  reason: string;
  status: string;
  notes?: string;
}

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    myPatients: 0,
    todaysAppointments: 0
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
  
  // Archive tab search and modal state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientAppointments, setSelectedPatientAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'My Patients' },
    { id: 'archive', label: 'Archive' },
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
      fetchTodaysAppointments();
    } else if (activeTab === 'archive') {
      fetchArchiveData();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch patients
      const patientsResponse = await fetch(`${API_BASE_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch appointments
      const appointmentsResponse = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setStats(prev => ({
          ...prev,
          myPatients: patientsData.length
        }));
      }

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointmentsData.filter((apt: any) => 
          apt.appointment_date?.split('T')[0] === today
        );

        setStats(prev => ({
          ...prev,
          todaysAppointments: todaysAppointments.length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        myPatients: 0,
        todaysAppointments: 0
      });
    }
  };

  const fetchTodaysAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const appointmentsData = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const todaysAppts = appointmentsData.filter((apt: any) => 
          apt.appointment_date?.split('T')[0] === today
        );
        setTodaysAppointments(todaysAppts);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s appointments:', error);
      setTodaysAppointments([]);
    }
  };

  const fetchArchiveData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch patients for archive
      const patientsResponse = await fetch(`${API_BASE_URL}/api/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch appointments for archive
      const appointmentsResponse = await fetch(`${API_BASE_URL}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
      }

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      }
    } catch (error) {
      console.error('Failed to fetch archive data:', error);
      setPatients([]);
      setAppointments([]);
    }
  };

  const getPatientAppointments = (patientId: number) => {
    return appointments.filter(apt => apt.patient_id === patientId);
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => p.patient_id === patientId);
    return patient ? patient.full_name : 'Unknown Patient';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWelcomeMessage = () => {
    const displayName = user?.full_name;
    if (!displayName) return 'Welcome';
    
    if (user?.role === 'Doctor') {
      return `Welcome, Dr. ${displayName}`;
    }
    return `Welcome, ${displayName}`;
  };

  const statsCards = [
    { title: 'My Patients', value: stats.myPatients.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Today\'s Appointments', value: stats.todaysAppointments.toString(), icon: Calendar, color: 'text-green-600' }
  ];

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedPatientAppointments(getPatientAppointments(patient.patient_id));
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-gray-600 mt-2">Manage your patients and appointments</p>
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

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>All your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todaysAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {new Date(appointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {getPatientName(appointment.patient_id)}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600">
                              <strong>Notes:</strong> {appointment.notes}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No appointments found for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && <AppointmentManagement />}

        {/* Patients Tab */}
        {activeTab === 'patients' && <PatientManagement />}

        {/* Archive Tab */}
        {activeTab === 'archive' && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Archive</CardTitle>
              <CardDescription>Patient history, appointments, and records</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search patients by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => {
                    const patientAppointments = getPatientAppointments(patient.patient_id);
                    const lastAppointment = patientAppointments[patientAppointments.length - 1];
                    
                    return (
                      <div key={patient.patient_id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{patient.full_name}</p>
                          <p className="text-sm text-gray-600">
                            Email: {patient.email} | Phone: {patient.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last appointment: {lastAppointment ? 
                              new Date(lastAppointment.appointment_date).toLocaleDateString() : 
                              'No appointments yet'
                            }
                          </p>
                          <p className="text-sm text-gray-500">
                            Total appointments: {patientAppointments.length} | 
                            Status: {patient.is_active ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleViewPatient(patient)}
                          variant="outline"
                        >
                          View
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    {searchTerm ? 'No patients found matching your search' : 'No patient data found yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        appointments={selectedPatientAppointments}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
