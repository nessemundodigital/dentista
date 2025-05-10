import { useState } from 'react';
import { useApp, PatientData, PatientStatus } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { reasonOptions } from "@/types/reasonOptions";
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Calendar, MessageSquare, Clock, User, Mail, CheckCircle2, Loader2, Image } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const statusOptions: { value: PatientStatus; label: string; color: string; bgColor: string }[] = [
  { value: 'pending', label: 'Pendente', color: 'text-amber-800', bgColor: 'bg-amber-100' },
  { value: 'scheduled', label: 'Agendado', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  { value: 'noshow', label: 'Não Compareceu', color: 'text-red-800', bgColor: 'bg-red-100' },
  { value: 'completed', label: 'Finalizado', color: 'text-green-800', bgColor: 'bg-green-100' },
];

const PatientList = () => {
  const { patients = [], updatePatientStatus, updatePatientNotes, isLoading } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  
  const handleStatusChange = async (value: string, patientId: string) => {
    setSavingStatus(patientId);
    await updatePatientStatus(patientId, value as PatientStatus);
    setSavingStatus(null);
  };
  
  const handleNotesChange = async (notes: string) => {
    if (selectedPatient) {
      setSavingNotes(true);
      await updatePatientNotes(selectedPatient.id, notes);
      setSelectedPatient({...selectedPatient, notes});
      setSavingNotes(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMM', às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const handleImageError = (imageUrl: string) => {
    console.log("Erro ao carregar imagem:", imageUrl);
    setImageLoadErrors(prev => ({ ...prev, [imageUrl]: true }));
    toast.error("Falha ao carregar uma imagem do paciente");
  };

  const getStatusBadge = (status: PatientStatus) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusOption?.color} ${statusOption?.bgColor}`}>
        {statusOption?.label || status}
      </span>
    );
  };

  const getStatusColor = (status: PatientStatus) => {
    switch(status) {
      case 'pending': return '#F59E0B'; // amber-500
      case 'scheduled': return '#3B82F6'; // blue-500
      case 'noshow': return '#EF4444'; // red-500
      case 'completed': return '#10B981'; // green-500
      default: return '#D1D5DB'; // gray-300
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Carregando pacientes...</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum paciente registrado</h3>
        <p className="text-gray-500">Os pacientes aparecerão aqui quando se registrarem no formulário.</p>
      </div>
    );
  }

  console.log("Total de pacientes:", patients.length);
  patients.forEach(patient => {
    console.log(`Paciente ${patient.name} tem ${patient.images?.length || 0} imagens:`, patient.images);
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {patients.map((patient) => (
          <Card 
            key={patient.id}
            className="overflow-hidden transition-all hover:shadow-lg border-0 shadow-md"
            style={{
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 3px ${getStatusColor(patient.status)}25`
            }}
          >
            <div 
              className="h-2 w-full" 
              style={{ backgroundColor: getStatusColor(patient.status) }}
            />
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <h3 className="font-medium text-lg truncate">{patient.name}</h3>
                </div>
                {getStatusBadge(patient.status)}
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                  <span className="truncate">{patient.whatsapp}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-amber-500" />
                  <span className="truncate">
                    {reasonOptions.find(opt => opt.value === patient.reason)?.label || patient.reason}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-purple-500" />
                  <span className="truncate">{formatDate(patient.submittedAt)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
                  <span className="truncate">Horário: {patient.preferredTime}</span>
                </div>

                {patient.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0 text-red-500" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                )}
                
                {patient.isExistingPatient && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Paciente existente</span>
                  </div>
                )}
                
                {patient.images && patient.images.length > 0 && (
                  <div className="flex items-center text-blue-600">
                    <Image className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{patient.images.length} imagem(ns) anexada(s)</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                <div className="flex-1">
                  <Select
                    value={patient.status}
                    onValueChange={(value) => handleStatusChange(value, patient.id)}
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue>{getStatusBadge(patient.status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {getStatusBadge(status.value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPatient(patient)}
                  className="ml-2"
                >
                  Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        {selectedPatient && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Paciente</DialogTitle>
              <DialogDescription>
                Registrado em {formatDate(selectedPatient.submittedAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Nome</h3>
                  <p>{selectedPatient.name}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">WhatsApp</h3>
                  <p>{selectedPatient.whatsapp}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Email</h3>
                  <p>{selectedPatient.email || "Não informado"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Motivo</h3>
                  <p>{reasonOptions.find(opt => opt.value === selectedPatient.reason)?.label || selectedPatient.reason}</p>
                  {selectedPatient.reasonDetail && (
                    <p className="text-sm text-gray-600 mt-1">{selectedPatient.reasonDetail}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Paciente Existente</h3>
                  <p>{selectedPatient.isExistingPatient ? "Sim" : "Não"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Horário Preferido</h3>
                  <p>{selectedPatient.preferredTime}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Status</h3>
                  <div className="mt-1">
                    <Select
                      value={selectedPatient.status}
                      onValueChange={(value) => handleStatusChange(value, selectedPatient.id)}
                    >
                      <SelectTrigger>
                        <SelectValue>{getStatusBadge(selectedPatient.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {getStatusBadge(status.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {selectedPatient.images && selectedPatient.images.length > 0 ? (
                  <div>
                    <h3 className="font-medium text-sm text-gray-500 mb-2">
                      Imagens Enviadas ({selectedPatient.images.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedPatient.images.map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className="group relative border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => {
                            console.log("Clicou na imagem:", imageUrl);
                            setSelectedImage(imageUrl);
                          }}
                        >
                          <div className="aspect-square w-full relative">
                            {imageLoadErrors[imageUrl] ? (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <span className="text-xs text-gray-500">Erro ao carregar imagem</span>
                              </div>
                            ) : (
                              <>
                                <img 
                                  src={imageUrl} 
                                  alt={`Imagem ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                  onError={() => handleImageError(imageUrl)}
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <span className="text-white bg-black/50 px-2 py-1 rounded text-xs">
                                    Ampliar
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed">
                    <Image className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">Nenhuma imagem enviada</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Anotações Internas</h3>
                  <Textarea
                    placeholder="Adicione anotações sobre o paciente aqui..."
                    value={selectedPatient.notes || ''}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="min-h-[150px]"
                  />
                  {savingNotes && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Salvando...
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedPatient(null)}
              >
                Fechar
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  window.open(`https://wa.me/${selectedPatient.whatsapp.replace(/\D/g, '')}`, '_blank');
                }}
              >
                Contatar via WhatsApp
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        {selectedImage && (
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <div className="relative">
              {imageLoadErrors[selectedImage] ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded">
                  <Image className="h-16 w-16 text-gray-300 mb-2" />
                  <p className="text-gray-500">Não foi possível carregar a imagem</p>
                </div>
              ) : (
                <img 
                  src={selectedImage} 
                  alt="Imagem ampliada" 
                  className="w-full h-auto max-h-[70vh] object-contain"
                  onError={() => handleImageError(selectedImage)}
                />
              )}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-0 right-0 rounded-full"
                onClick={() => window.open(selectedImage, '_blank')}
                disabled={imageLoadErrors[selectedImage]}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Button>
            </div>
            <div className="flex justify-end mt-2">
              <Button onClick={() => setSelectedImage(null)}>Fechar</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default PatientList;
