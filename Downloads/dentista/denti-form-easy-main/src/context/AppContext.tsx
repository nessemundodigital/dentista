
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

export type PatientStatus = 'pending' | 'scheduled' | 'noshow' | 'completed';

export interface PatientData {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  reason: string;
  reasonDetail?: string;
  isExistingPatient: boolean;
  preferredTime: string;
  images: string[];
  submittedAt: string;
  status: PatientStatus;
  notes?: string;
}

export interface SocialMedia {
  id: string;
  type: 'facebook' | 'instagram' | 'youtube' | 'other';
  url: string;
  name?: string;
  icon?: string;
}

export interface BrandingData {
  clinicName: string;
  logoUrl: string;
  primaryColor: string;
  socialMedia: SocialMedia[];
}

interface AppContextType {
  patients: PatientData[];
  addPatient: (patient: Omit<PatientData, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  updatePatientStatus: (id: string, status: PatientStatus) => Promise<void>;
  updatePatientNotes: (id: string, notes: string) => Promise<void>;
  branding: BrandingData;
  updateBranding: (branding: Partial<BrandingData>) => Promise<void>;
  addSocialMedia: (socialMedia: Omit<SocialMedia, 'id'>) => Promise<void>;
  updateSocialMedia: (id: string, data: Partial<Omit<SocialMedia, 'id'>>) => Promise<void>;
  deleteSocialMedia: (id: string) => Promise<void>;
  clearOldPatients: () => Promise<void>;
  isLoading: boolean;
}

const defaultBranding: BrandingData = {
  clinicName: 'Clínica Odontológica',
  logoUrl: 'https://via.placeholder.com/150?text=Logo',
  primaryColor: '#0ea5e9', // Default to our primary blue
  socialMedia: []
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Carregando dados do Supabase...");
      
      // Fetch patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (patientsError) {
        console.error('Error fetching patients:', patientsError);
        toast.error('Erro ao carregar pacientes');
      }

      // Fetch patient images - modified to reduce timeout issues
      const { data: imagesData, error: imagesError } = await supabase
        .from('patient_images')
        .select('*');
      
      if (imagesError) {
        console.error('Error fetching images:', imagesError);
        toast.error('Erro ao carregar imagens dos pacientes');
      }

      console.log("Imagens carregadas:", imagesData || []);

      // Fetch clinic branding
      const { data: brandingData, error: brandingError } = await supabase
        .from('clinic_branding')
        .select('*')
        .single();
      
      if (brandingError && brandingError.code !== 'PGRST116') {
        console.error('Error fetching branding:', brandingError);
        toast.error('Erro ao carregar informações da clínica');
      }

      // Fetch social media
      const { data: socialData, error: socialError } = await supabase
        .from('social_media')
        .select('*');
      
      if (socialError) {
        console.error('Error fetching social media:', socialError);
      }

      // Process and set patients data
      if (patientsData) {
        const processedPatients = patientsData.map(patient => {
          // Find all images for this patient
          const patientImages = imagesData
            ? imagesData
              .filter(img => img.patient_id === patient.id)
              .map(img => {
                console.log("Image URL for patient", patient.id, ":", img.image_url);
                return img.image_url;
              })
            : [];

          return {
            id: patient.id,
            name: patient.name,
            whatsapp: patient.whatsapp,
            email: patient.email || undefined,
            reason: patient.reason,
            reasonDetail: patient.reason_detail || undefined,
            isExistingPatient: patient.is_existing_patient,
            preferredTime: patient.preferred_time,
            images: patientImages,
            submittedAt: patient.submitted_at,
            status: patient.status as PatientStatus,
            notes: patient.notes || undefined
          };
        });

        console.log("Pacientes processados:", processedPatients.length);
        setPatients(processedPatients);
      }

      // Set branding data
      if (brandingData) {
        const brandingObj: BrandingData = {
          clinicName: brandingData.clinic_name,
          logoUrl: brandingData.logo_url || defaultBranding.logoUrl,
          primaryColor: brandingData.primary_color || defaultBranding.primaryColor,
          socialMedia: socialData ? socialData.map(social => ({
            id: social.id,
            type: social.type as any,
            url: social.url,
            name: social.name || undefined,
            icon: social.icon || undefined
          })) : []
        };

        setBranding(brandingObj);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Ocorreu um erro ao carregar os dados');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Função otimizada para lidar com uploads de imagens
  const addPatient = async (patientData: Omit<PatientData, 'id' | 'submittedAt' | 'status'>) => {
    try {
      console.log("Adicionando paciente com", patientData.images?.length || 0, "imagens");
      
      // Insert patient data
      const { data: newPatient, error } = await supabase
        .from('patients')
        .insert({
          name: patientData.name,
          whatsapp: patientData.whatsapp,
          email: patientData.email,
          reason: patientData.reason,
          reason_detail: patientData.reasonDetail,
          is_existing_patient: patientData.isExistingPatient,
          preferred_time: patientData.preferredTime
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error adding patient:', error);
        toast.error('Erro ao adicionar paciente');
        return;
      }

      let patientImages: string[] = [];
      
      // Insert patient images if there are any - modified to handle one at a time
      if (patientData.images && patientData.images.length > 0 && newPatient) {
        console.log("Inserindo", patientData.images.length, "imagens para o paciente", newPatient.id);
        
        // Inserir imagens uma por uma
        for (const imageUrl of patientData.images) {
          try {
            console.log(`Iniciando upload da imagem para o paciente ${newPatient.id}`);
            
            const { error: imageError, data } = await supabase
              .from('patient_images')
              .insert({
                patient_id: newPatient.id,
                image_url: imageUrl
              })
              .select('*')
              .single();

            if (imageError) {
              console.error('Error adding patient image:', imageError);
              toast.error('Erro ao adicionar uma imagem');
            } else if (data) {
              patientImages.push(data.image_url);
              console.log('Imagem adicionada com sucesso:', data.id);
            }
          } catch (imgError) {
            console.error('Exception when adding image:', imgError);
          }
        }
      }

      // Add new patient to state
      if (newPatient) {
        const newPatientData: PatientData = {
          id: newPatient.id,
          name: newPatient.name,
          whatsapp: newPatient.whatsapp,
          email: newPatient.email || undefined,
          reason: newPatient.reason,
          reasonDetail: newPatient.reason_detail || undefined,
          isExistingPatient: newPatient.is_existing_patient,
          preferredTime: newPatient.preferred_time,
          images: patientImages,
          submittedAt: newPatient.submitted_at,
          status: newPatient.status as PatientStatus,
          notes: newPatient.notes || undefined
        };

        setPatients(prev => [newPatientData, ...prev]);
        toast.success('Paciente adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error in addPatient:', error);
      toast.error('Erro ao adicionar paciente');
    }
  };

  const updatePatientStatus = async (id: string, status: PatientStatus) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating patient status:', error);
        toast.error('Erro ao atualizar status do paciente');
        return;
      }

      setPatients(prev => 
        prev.map(patient => 
          patient.id === id ? { ...patient, status } : patient
        )
      );
    } catch (error) {
      console.error('Error in updatePatientStatus:', error);
      toast.error('Erro ao atualizar status do paciente');
    }
  };

  const updatePatientNotes = async (id: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ notes })
        .eq('id', id);

      if (error) {
        console.error('Error updating patient notes:', error);
        toast.error('Erro ao atualizar anotações do paciente');
        return;
      }

      setPatients(prev => 
        prev.map(patient => 
          patient.id === id ? { ...patient, notes } : patient
        )
      );
    } catch (error) {
      console.error('Error in updatePatientNotes:', error);
      toast.error('Erro ao atualizar anotações do paciente');
    }
  };

  const updateBranding = async (newBranding: Partial<BrandingData>) => {
    try {
      const { data: existingBranding } = await supabase
        .from('clinic_branding')
        .select('id')
        .single();

      const brandingId = existingBranding?.id;

      if (brandingId) {
        // Update existing branding
        const { error } = await supabase
          .from('clinic_branding')
          .update({
            clinic_name: newBranding.clinicName !== undefined ? newBranding.clinicName : branding.clinicName,
            logo_url: newBranding.logoUrl !== undefined ? newBranding.logoUrl : branding.logoUrl,
            primary_color: newBranding.primaryColor !== undefined ? newBranding.primaryColor : branding.primaryColor,
            updated_at: new Date().toISOString()
          })
          .eq('id', brandingId);

        if (error) {
          console.error('Error updating branding:', error);
          toast.error('Erro ao atualizar informações da clínica');
          return;
        }
      } else {
        // Create new branding
        const { error } = await supabase
          .from('clinic_branding')
          .insert({
            clinic_name: newBranding.clinicName || branding.clinicName,
            logo_url: newBranding.logoUrl || branding.logoUrl,
            primary_color: newBranding.primaryColor || branding.primaryColor
          });

        if (error) {
          console.error('Error creating branding:', error);
          toast.error('Erro ao criar informações da clínica');
          return;
        }
      }

      // Update state
      setBranding(prev => ({ ...prev, ...newBranding }));
      toast.success('Informações da clínica atualizadas com sucesso!');
    } catch (error) {
      console.error('Error in updateBranding:', error);
      toast.error('Erro ao atualizar informações da clínica');
    }
  };

  const addSocialMedia = async (socialMedia: Omit<SocialMedia, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('social_media')
        .insert({
          type: socialMedia.type,
          url: socialMedia.url,
          name: socialMedia.name,
          icon: socialMedia.icon
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error adding social media:', error);
        if (error.details) {
          console.error('Error details:', error.details);
        }
        if (error.hint) {
          console.error('Error hint:', error.hint);
        }
        toast.error(`Erro ao adicionar mídia social: ${error.message || 'Erro desconhecido'}`);
        return;
      }

      if (data) {
        const newSocialMedia: SocialMedia = {
          id: data.id,
          type: data.type as any,
          url: data.url,
          name: data.name || undefined,
          icon: data.icon || undefined
        };
        
        setBranding(prev => ({
          ...prev,
          socialMedia: [...prev.socialMedia, newSocialMedia]
        }));
        // Mover toast.success para cá para garantir que só aparece se não houver erro
        toast.success('Mídia social adicionada com sucesso!');
        await fetchData();
      } else {
        console.error('No data returned when adding social media');
        toast.error('Erro ao adicionar mídia social: sem dados retornados');
      }
    } catch (error) {
      console.error('Error in addSocialMedia:', error);
      toast.error('Erro ao adicionar mídia social');
    }
  };

  const updateSocialMedia = async (id: string, data: Partial<Omit<SocialMedia, 'id'>>) => {
    try {
      const { error } = await supabase
        .from('social_media')
        .update({
          type: data.type,
          url: data.url,
          name: data.name,
          icon: data.icon,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating social media:', error);
        toast.error('Erro ao atualizar mídia social');
        return;
      }

      setBranding(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.map(item => 
          item.id === id ? { ...item, ...data } : item
        )
      }));
      toast.success('Mídia social atualizada com sucesso!');
      await fetchData();
    } catch (error) {
      console.error('Error in updateSocialMedia:', error);
      toast.error('Erro ao atualizar mídia social');
    }
  };

  const deleteSocialMedia = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting social media:', error);
        toast.error('Erro ao excluir mídia social');
        return;
      }

      setBranding(prev => ({
        ...prev,
        socialMedia: prev.socialMedia.filter(item => item.id !== id)
      }));
      toast.success('Mídia social excluída com sucesso!');
      await fetchData();
    } catch (error) {
      console.error('Error in deleteSocialMedia:', error);
      toast.error('Erro ao excluir mídia social');
    }
  };

  const clearOldPatients = async () => {
    try {
      // Get all patients sorted by submission date
      const { data } = await supabase
        .from('patients')
        .select('id, submitted_at')
        .order('submitted_at', { ascending: false });

      if (!data || data.length <= 10) {
        toast.info('Não há pacientes antigos para arquivar.');
        return;
      }

      // Keep only the 10 most recent patients
      const patientsToDelete = data.slice(10).map(p => p.id);

      // Delete older patients
      const { error } = await supabase
        .from('patients')
        .delete()
        .in('id', patientsToDelete);

      if (error) {
        console.error('Error deleting old patients:', error);
        toast.error('Erro ao arquivar pacientes antigos');
        return;
      }

      // Update state to remove deleted patients
      setPatients(prev => prev.filter(p => !patientsToDelete.includes(p.id)));
      toast.success('Pacientes antigos foram arquivados para liberar espaço de armazenamento.');
    } catch (error) {
      console.error('Error in clearOldPatients:', error);
      toast.error('Erro ao arquivar pacientes antigos');
    }
  };

  return (
    <AppContext.Provider 
      value={{ 
        patients, 
        addPatient, 
        updatePatientStatus, 
        updatePatientNotes,
        branding,
        updateBranding,
        addSocialMedia,
        updateSocialMedia,
        deleteSocialMedia,
        clearOldPatients,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
