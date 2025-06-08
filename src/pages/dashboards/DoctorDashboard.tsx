
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { AppointmentManagement } from '@/components/AppointmentManagement';
import { PatientManagement } from '@/components/PatientManagement';
import { Users, Calendar, FileText, Archive } from 'lucide-react';
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
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
}

export const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    myPatients: 0,
    todaysAppointments: 0,
    completedAppointments: 0,
    patientRecords: 0
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'My Patients' },
    { id: 'archive', label: 'Archive' },
  ];

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
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
          myPatients: patientsData.length,
          patientRecords: patientsData.length
        }));
      }

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointmentsData.filter((apt: any) => 
          apt.appointment_date?.split('T')[0] === today
        );
        const completedAppointments = appointmentsData.filter((apt: any) => 
          apt.status === 'completed'
        );

        setStats(prev => ({
          ...prev,
          todaysAppointments: todaysAppointments.length,
          completedAppointments: completedAppointments.length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        myPatients: 0,
        todaysAppointments: 0,
        completedAppointments: 0,
        patientRecords: 0
      });
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
    return appointments.filter(apt => apt.patient_name); // This would need proper patient ID matching
  };

  const statsCards = [
    { title: 'My Patients', value: stats.myPatients.toString(), icon: Users, color: 'text-blue-600' },
    { title: 'Today\'s Appointments', value: stats.todaysAppointments.toString(), icon: Calendar, color: 'text-green-600' },
    { title: 'Completed Appointments', value: stats.completedAppointments.toString(), icon: FileText, color: 'text-purple-600' },
    { title: 'Patient Records', value: stats.patientRecords.toString(), icon: Archive, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Today's Completed Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Completed Appointments</CardTitle>
                <CardDescription>Your completed appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.completedAppointments > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .filter(apt => apt.status === 'completed')
                      .slice(0, 3)
                      .map((appointment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{appointment.appointment_time} - {appointment.patient_name}</p>
                            <p className="text-sm text-gray-600">{appointment.notes || 'Appointment completed'}</p>
                          </div>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No completed appointments found yet</p>
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
              {patients.length > 0 ? (
                <div className="space-y-4">
                  {patients.map((patient) => {
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
                        <Badge>View History</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No patient data found yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
