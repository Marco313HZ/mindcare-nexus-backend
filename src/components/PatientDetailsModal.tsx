
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  appointment_date: string;
  reason: string;
  status: string;
  notes?: string;
}

interface PatientDetailsModalProps {
  patient: Patient | null;
  appointments: Appointment[];
  isOpen: boolean;
  onClose: () => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  appointments,
  isOpen,
  onClose
}) => {
  if (!patient) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Patient Details</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p className="text-lg">{patient.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-lg">{patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-lg">{formatDate(patient.date_of_birth)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-lg">{patient.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant={patient.is_active ? "default" : "secondary"}>
                      {patient.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appointment History</CardTitle>
                <CardDescription>
                  Total appointments: {appointments.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments
                      .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
                      .map((appointment) => (
                      <div key={appointment.appointment_id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {formatDateTime(appointment.appointment_date)}
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No appointments found for this patient</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
