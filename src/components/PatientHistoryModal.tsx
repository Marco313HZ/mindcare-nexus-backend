
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  patient_id: number;
  full_name: string;
  email: string;
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
  description: string;
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
  const { toast } = useToast();

  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribed_date: ''
  });

  const [treatmentForm, setTreatmentForm] = useState({
    description: '',
    created_at: ''
  });

  useEffect(() => {
    if (patient && isOpen) {
      fetchPatientHistory();
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
    if (!patient) return;

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch(`${API_BASE_URL}/api/treatments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patient_id: patient.patient_id,
          doctor_id: parseInt(userId || '1'),
          ...treatmentForm
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Treatment created successfully"
        });
        setTreatmentForm({ description: '', created_at: '' });
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
    if (!editingTreatment) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/treatments/${editingTreatment.treatment_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatmentForm)    
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Treatment updated successfully"
        });
        setEditingTreatment(null);
        setTreatmentForm({ description: '', created_at: '' });
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
      description: treatment.description,
      created_at: treatment.created_at.split('T')[0]
    });
  };

  const resetForms = () => {
    setMedicationForm({ name: '', dosage: '', frequency: '', prescribed_date: '' });
    setTreatmentForm({ description: '', created_at: '' });
    setEditingMedication(null);
    setEditingTreatment(null);
    setShowMedicationForm(false);
    setShowTreatmentForm(false);
  };

  const handleClose = () => {
    resetForms();
    onClose();
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
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            value={treatmentForm.description}
                            onChange={(e) => setTreatmentForm({...treatmentForm, description: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <Input
                            type="date"
                            value={treatmentForm.created_at}
                            onChange={(e) => setTreatmentForm({...treatmentForm, created_at: e.target.value})}
                            required
                          />
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
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <strong>Date:</strong> {new Date(treatment.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-sm">
                                <strong>Description:</strong>
                              </p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{treatment.description}</p>
                            </div>
                            <div className="flex gap-2">
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
