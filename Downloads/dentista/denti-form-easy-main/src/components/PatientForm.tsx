
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Image, Loader2, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const reasonOptions = [
  { value: "checkup", label: "Consulta de rotina" },
  { value: "pain", label: "Dor" },
  { value: "aesthetic", label: "Estética" },
  { value: "cleaning", label: "Limpeza" },
  { value: "other", label: "Outro motivo" },
];

const PatientForm = () => {
  const { addPatient, branding } = useApp();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [reasonDetail, setReasonDetail] = useState('');
  const [isExistingPatient, setIsExistingPatient] = useState<boolean | null>(null);
  const [preferredTime, setPreferredTime] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean[]>([false, false, false]);
  const [imageErrors, setImageErrors] = useState<boolean[]>([false, false, false]);
  const [dataConsent, setDataConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Função otimizada para tratamento de imagens
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Verificação de tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, envie apenas imagens');
      return;
    }

    // Verificação de tamanho do arquivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('A imagem é muito grande. O tamanho máximo é 5MB');
      return;
    }
    
    // Atualizar estado de carregamento
    const newImageLoading = [...imageLoading];
    newImageLoading[index] = true;
    setImageLoading(newImageLoading);
    
    // Resetar erro
    const newImageErrors = [...imageErrors];
    newImageErrors[index] = false;
    setImageErrors(newImageErrors);

    // Comprimir imagem antes de converter para base64
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const newImages = [...images];
          newImages[index] = event.target.result;
          setImages(newImages);
        }
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        const newImageErrors = [...imageErrors];
        newImageErrors[index] = true;
        setImageErrors(newImageErrors);
        toast.error('Erro ao processar a imagem');
      } finally {
        const newImageLoading = [...imageLoading];
        newImageLoading[index] = false;
        setImageLoading(newImageLoading);
      }
    };
    
    reader.onerror = () => {
      const newImageErrors = [...imageErrors];
      newImageErrors[index] = true;
      setImageErrors(newImageErrors);
      
      const newImageLoading = [...imageLoading];
      newImageLoading[index] = false;
      setImageLoading(newImageLoading);
      
      toast.error('Erro ao ler o arquivo');
    };
    
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = '';
    setImages(newImages);
    
    // Resetar erro e loading
    const newImageErrors = [...imageErrors];
    newImageErrors[index] = false;
    setImageErrors(newImageErrors);
    
    const newImageLoading = [...imageLoading];
    newImageLoading[index] = false;
    setImageLoading(newImageLoading);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !whatsapp || !reason || isExistingPatient === null || !preferredTime || !dataConsent) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filtrar apenas imagens válidas
      const validImages = images.filter(img => img !== '');
      
      await addPatient({
        name,
        whatsapp,
        email: email || undefined,
        reason,
        reasonDetail,
        isExistingPatient,
        preferredTime,
        images: validImages,
      });
      
      setSubmitted(true);
      toast.success('Informações enviadas com sucesso!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ocorreu um erro ao enviar o formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Obrigado!</h2>
        <p className="text-center text-gray-600 mb-6">
          Recebemos suas informações e entraremos em contato via WhatsApp em breve.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Enviar outro formulário
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-t-4" style={{borderTopColor: branding.primaryColor}}>
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-1" style={{backgroundColor: branding.primaryColor}}>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path d="M12 6v6h4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Agende sua consulta</CardTitle>
        <CardDescription className="text-center">
          Preencha os dados abaixo para agendar sua consulta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo*</Label>
            <Input 
              id="name" 
              placeholder="Digite seu nome completo" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="transition-all focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp*</Label>
            <Input 
              id="whatsapp" 
              placeholder="(00) 00000-0000" 
              type="tel"
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)} 
              required
              className="transition-all focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail (opcional)</Label>
            <Input 
              id="email" 
              placeholder="seu@email.com" 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="transition-all focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da consulta*</Label>
            <Select value={reason} onValueChange={setReason} required>
              <SelectTrigger id="reason" className="transition-all focus:border-sky-500 focus:ring-sky-500">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {reasonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {reason && (
            <div className="space-y-2">
              <Label htmlFor="reasonDetail">Detalhe o motivo (opcional)</Label>
              <Textarea 
                id="reasonDetail" 
                placeholder="Conte-nos mais sobre o motivo da sua consulta" 
                value={reasonDetail} 
                onChange={e => setReasonDetail(e.target.value)}
                className="transition-all focus:border-sky-500 focus:ring-sky-500" 
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Já é paciente da clínica?*</Label>
            <RadioGroup 
              value={isExistingPatient ? "sim" : isExistingPatient === false ? "nao" : ""} 
              onValueChange={(value) => setIsExistingPatient(value === "sim")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="existing-yes" />
                <Label htmlFor="existing-yes">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="existing-no" />
                <Label htmlFor="existing-no">Não</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Melhor dia e horário para atendimento*</Label>
            <Input 
              id="preferredTime" 
              placeholder="Ex: Segunda-feira à tarde" 
              value={preferredTime} 
              onChange={e => setPreferredTime(e.target.value)} 
              required
              className="transition-all focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload de fotos (opcional, até 3 imagens)</Label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((index) => (
                <div 
                  key={index} 
                  className={`relative aspect-square border border-dashed rounded-lg flex flex-col items-center justify-center overflow-hidden group hover:border-sky-400 transition-all ${
                    imageErrors[index] ? 'border-red-500' : ''
                  }`}
                >
                  {imageLoading[index] ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <Loader2 className="h-6 w-6 text-sky-500 animate-spin mb-1" />
                      <span className="text-xs text-gray-500">Carregando...</span>
                    </div>
                  ) : imageErrors[index] ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <AlertCircle className="h-6 w-6 text-red-500 mb-1" />
                      <span className="text-xs text-red-500">Erro</span>
                      <button 
                        type="button"
                        className="text-xs text-blue-500 hover:underline mt-1"
                        onClick={() => {
                          const newErrors = [...imageErrors];
                          newErrors[index] = false;
                          setImageErrors(newErrors);
                        }}
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : images[index] ? (
                    <>
                      <img 
                        src={images[index]} 
                        alt={`Imagem ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-80 hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <label 
                      htmlFor={`image-${index}`} 
                      className="flex flex-col items-center justify-center h-full w-full cursor-pointer transition-all group-hover:scale-105"
                    >
                      <Image className="w-6 h-6 text-gray-400 mb-1 group-hover:text-sky-500" />
                      <span className="text-xs text-center text-gray-500 group-hover:text-sky-600">
                        Adicionar
                      </span>
                      <input 
                        id={`image-${index}`} 
                        type="file" 
                        accept="image/jpeg,image/png,image/gif,image/webp" 
                        className="hidden" 
                        onChange={(e) => handleUploadImage(e, index)} 
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Clique nas áreas tracejadas para adicionar imagens. Tamanho máximo: 5MB por imagem.</p>
          </div>
          
          <div className="flex items-start space-x-2 pt-2">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="dataConsent"
                type="checkbox"
                checked={dataConsent}
                onChange={e => setDataConsent(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="dataConsent" className="text-gray-700">
                Autorizo o uso dos meus dados para contato*
              </label>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full transition-transform active:scale-[0.98] text-base py-6"
              disabled={isSubmitting || imageLoading.some(loading => loading)}
              style={{ backgroundColor: branding.primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : "Agendar Consulta"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center pt-0 pb-6">
        <p className="text-xs text-center text-gray-500 mt-4">
          * Campos obrigatórios
        </p>
      </CardFooter>
    </Card>
  );
};

export default PatientForm;
