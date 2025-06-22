
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  patient_id: number;
  full_name: string;
  email: string;
}

interface Doctor {
  doctor_id: number;
  full_name: string;
}

interface Medication {
  medication_id: number;
  patient_id: number;
  doctor_id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescribed_date: string;
}

interface Treatment {
  treatment_id: number;
  patient_id: number;
  doctor_id: number;
  diagnosis: string;
  treatment_plan: string;
  start_date: string;
  end_date: string | null;
  status: string;
  created_at: string;
}

interface PatientHistory {
  patient: Patient;
  history: {
    medications: Medication[];
    treatments: Treatment[];
  };
}

interface PatientHistoryModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const [patientHistory, setPatientHistory] = useState<PatientHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('medications');
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { toast } = useToast();

  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribed_date: ''
  });

  const [treatmentForm, setTreatmentForm] = useState({
    patient_id: '',
    doctor_id: '',
    diagnosis: '',
    treatment_plan: '',
    start_date: '',
    end_date: '',
    status: 'Active'
  });

  useEffect(() => {
    if (patient && isOpen) {
      fetchPatientHistory();
      fetchPatientsAndDoctors();
    }
  }, [patient, isOpen]);

  const fetchPatientHistory = async () => {
    if (!patient) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/patients/${patient.patient_id}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPatientHistory(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch patient history",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to fetch patient history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch patient history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsAndDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [patientsResponse, doctorsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/api/doctors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);
      }

      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error('Failed to fetch patients and doctors:', error);
    }
  };

  const handleCreateMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch(`${API_BASE_URL}/api/medications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patient.patient_id,
          doctor_id: parseInt(userId || '1'),
          ...medicationForm
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medication created successfully"
        });
        setMedicationForm({ name: '', dosage: '', frequency: '', prescribed_date: '' });
        setShowMedicationForm(false);
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to create medication",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to create medication:', error);
      toast({
        title: "Error",
        description: "Failed to create medication",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedication) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/medications/${editingMedication.medication_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(medicationForm)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medication updated successfully"
        });
        setEditingMedication(null);
        setMedicationForm({ name: '', dosage: '', frequency: '', prescribed_date: '' });
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to update medication",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to update medication:', error);
      toast({
        title: "Error",
        description: "Failed to update medication",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedication = async (medicationId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/medications/${medicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medication deleted successfully"
        });
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete medication",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to delete medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive"
      });
    }
  };

  const handleCreateTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatmentForm.patient_id || !treatmentForm.doctor_id || !treatmentForm.start_date) {
      toast({
        title: "Error",
        description: "Patient, Doctor, and Start Date are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        patient_id: parseInt(treatmentForm.patient_id),
        doctor_id: parseInt(treatmentForm.doctor_id),
        diagnosis: treatmentForm.diagnosis,
        treatment_plan: treatmentForm.treatment_plan,
        start_date: treatmentForm.start_date,
        end_date: treatmentForm.end_date || null,
        status: treatmentForm.status
      };

      const response = await fetch(`${API_BASE_URL}/api/treatments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Treatment created successfully"
        });
        setTreatmentForm({
          patient_id: '',
          doctor_id: '',
          diagnosis: '',
          treatment_plan: '',
          start_date: '',
          end_date: '',
          status: 'Active'
        });
        setShowTreatmentForm(false);
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to create treatment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to create treatment:', error);
      toast({
        title: "Error",
        description: "Failed to create treatment",
        variant: "destructive"
      });
    }
  };

  const handleUpdateTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTreatment || !treatmentForm.patient_id || !treatmentForm.doctor_id || !treatmentForm.start_date) {
      toast({
        title: "Error",
        description: "Patient, Doctor, and Start Date are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        patient_id: parseInt(treatmentForm.patient_id),
        doctor_id: parseInt(treatmentForm.doctor_id),
        diagnosis: treatmentForm.diagnosis,
        treatment_plan: treatmentForm.treatment_plan,
        start_date: treatmentForm.start_date,
        end_date: treatmentForm.end_date || null,
        status: treatmentForm.status
      };

      const response = await fetch(`${API_BASE_URL}/api/treatments/${editingTreatment.treatment_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Treatment updated successfully"
        });
        setEditingTreatment(null);
        setTreatmentForm({
          patient_id: '',
          doctor_id: '',
          diagnosis: '',
          treatment_plan: '',
          start_date: '',
          end_date: '',
          status: 'Active'
        });
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to update treatment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to update treatment:', error);
      toast({
        title: "Error",
        description: "Failed to update treatment",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTreatment = async (treatmentId: number) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/treatments/${treatmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Treatment deleted successfully"
        });
        fetchPatientHistory();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete treatment",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to delete treatment:', error);
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive"
      });
    }
  };

  const startEditingMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setMedicationForm({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      prescribed_date: medication.prescribed_date.split('T')[0]
    });
  };

  const startEditingTreatment = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setTreatmentForm({
      patient_id: treatment.patient_id.toString(),
      doctor_id: treatment.doctor_id.toString(),
      diagnosis: treatment.diagnosis,
      treatment_plan: treatment.treatment_plan,
      start_date: treatment.start_date.split('T')[0],
      end_date: treatment.end_date ? treatment.end_date.split('T')[0] : '',
      status: treatment.status
    });
  };

  const resetForms = () => {
    setMedicationForm({ name: '', dosage: '', frequency: '', prescribed_date: '' });
    setTreatmentForm({
      patient_id: '',
      doctor_id: '',
      diagnosis: '',
      treatment_plan: '',
      start_date: '',
      end_date: '',
      status: 'Active'
    });
    setEditingMedication(null);
    setEditingTreatment(null);
    setShowMedicationForm(false);
    setShowTreatmentForm(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => p.patient_id === patientId);
    return patient ? patient.full_name : 'Unknown Patient';
  };

  const getDoctorName = (doctorId: number) => {
    const doctor = doctors.find(d => d.doctor_id === doctorId);
    return doctor ? doctor.full_name : 'Unknown Doctor';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Patient History - {patient.full_name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading patient history...</p>
            </div>
          ) : patientHistory ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="medications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Medications</h3>
                  <Button onClick={() => setShowMedicationForm(!showMedicationForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Medication
                  </Button>
                </div>

                {(showMedicationForm || editingMedication) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={editingMedication ? handleUpdateMedication : handleCreateMedication} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                              value={medicationForm.name}
                              onChange={(e) => setMedicationForm({...medicationForm, name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Dosage</label>
                            <Input
                              value={medicationForm.dosage}
                              onChange={(e) => setMedicationForm({...medicationForm, dosage: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Frequency</label>
                            <Input
                              value={medicationForm.frequency}
                              onChange={(e) => setMedicationForm({...medicationForm, frequency: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Prescribed Date</label>
                            <Input
                              type="date"
                              value={medicationForm.prescribed_date}
                              onChange={(e) => setMedicationForm({...medicationForm, prescribed_date: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editingMedication ? 'Update' : 'Create'}
                          </Button>
                          <Button type="button" variant="outline" onClick={resetForms}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {patientHistory.history.medications.length > 0 ? (
                    patientHistory.history.medications.map((medication) => (
                      <Card key={medication.medication_id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h4 className="font-medium text-lg">{medication.name}</h4>
                              <p className="text-sm text-gray-600">
                                <strong>Dosage:</strong> {medication.dosage}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Frequency:</strong> {medication.frequency}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Prescribed:</strong> {new Date(medication.prescribed_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Doctor:</strong> {getDoctorName(medication.doctor_id)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => startEditingMedication(medication)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this medication? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMedication(medication.medication_id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-600">No medications found</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="treatments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Treatments</h3>
                  <Button onClick={() => setShowTreatmentForm(!showTreatmentForm)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Treatment
                  </Button>
                </div>

                {(showTreatmentForm || editingTreatment) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={editingTreatment ? handleUpdateTreatment : handleCreateTreatment} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Patient *</label>
                            <Select value={treatmentForm.patient_id} onValueChange={(value) => setTreatmentForm({...treatmentForm, patient_id: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select patient" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map((p) => (
                                  <SelectItem key={p.patient_id} value={p.patient_id.toString()}>
                                    {p.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Doctor *</label>
                            <Select value={treatmentForm.doctor_id} onValueChange={(value) => setTreatmentForm({...treatmentForm, doctor_id: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select doctor" />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map((d) => (
                                  <SelectItem key={d.doctor_id} value={d.doctor_id.toString()}>
                                    {d.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Diagnosis *</label>
                            <Input
                              value={treatmentForm.diagnosis}
                              onChange={(e) => setTreatmentForm({...treatmentForm, diagnosis: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Treatment Plan *</label>
                            <Input
                              value={treatmentForm.treatment_plan}
                              onChange={(e) => setTreatmentForm({...treatmentForm, treatment_plan: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <Input
                              type="date"
                              value={treatmentForm.start_date}
                              onChange={(e) => setTreatmentForm({...treatmentForm, start_date: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <Input
                              type="date"
                              value={treatmentForm.end_date}
                              onChange={(e) => setTreatmentForm({...treatmentForm, end_date: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Status *</label>
                            <Select value={treatmentForm.status} onValueChange={(value) => setTreatmentForm({...treatmentForm, status: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Discontinued">Discontinued</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editingTreatment ? 'Update' : 'Create'}
                          </Button>
                          <Button type="button" variant="outline" onClick={resetForms}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {patientHistory.history.treatments.length > 0 ? (
                    patientHistory.history.treatments.map((treatment) => (
                      <Card key={treatment.treatment_id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <h4 className="font-medium text-lg">{treatment.diagnosis}</h4>
                                <Badge className={getStatusColor(treatment.status)}>
                                  {treatment.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <strong>Treatment Plan:</strong> {treatment.treatment_plan}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Doctor:</strong> {getDoctorName(treatment.doctor_id)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Patient:</strong> {getPatientName(treatment.patient_id)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <strong>Start Date:</strong> {new Date(treatment.start_date).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>End Date:</strong> {treatment.end_date ? new Date(treatment.end_date).toLocaleDateString() : 'Ongoing'}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Created:</strong> {new Date(treatment.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => startEditingTreatment(treatment)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Treatment</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this treatment? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteTreatment(treatment.treatment_id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-600">No treatments found</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load patient history</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
