
import { useState, useRef } from 'react';
import { useApp, type SocialMedia } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Copy, Facebook, Instagram, Plus, Save, Trash2, Upload, X, Youtube } from 'lucide-react';

const BrandingSettings = () => {
  const { branding, updateBranding, addSocialMedia, updateSocialMedia, deleteSocialMedia } = useApp();
  const [clinicName, setClinicName] = useState(branding.clinicName);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialType, setNewSocialType] = useState<SocialMedia['type']>('instagram');
  const [editingSocial, setEditingSocial] = useState<{id: string, url: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const appUrl = window.location.origin;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate a network request
    setTimeout(() => {
      updateBranding({
        clinicName,
        logoUrl: previewLogo || logoUrl,
        primaryColor,
      });
      
      setIsSaving(false);
      toast.success('Configurações atualizadas com sucesso');
    }, 500);
  };

  const sharedUrl = `${appUrl}/?shared=true`;

  const copyLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    toast.success('Link copiado para a área de transferência');
  };

  const copyWhatsAppLink = () => {
    const message = encodeURIComponent(`Olá! Para agilizar seu atendimento, por favor preencha o formulário através deste link: ${sharedUrl}`);
    navigator.clipboard.writeText(`https://wa.me/?text=${message}`);
    toast.success('Link do WhatsApp copiado');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      toast.error('Por favor, envie apenas arquivos de imagem');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erro ao processar a imagem');
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreviewLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddSocial = () => {
    if (!newSocialUrl.trim()) {
      toast.error('Digite o link da rede social');
      return;
    }
    
    // Adjust URL to add https:// if missing
    let urlToAdd = newSocialUrl.trim();
    if (!urlToAdd.startsWith('http://') && !urlToAdd.startsWith('https://')) {
      urlToAdd = 'https://' + urlToAdd;
      toast('Prefixo "https://" adicionado automaticamente ao link.');
    }
    
    // Basic URL validation with try-catch
    try {
      new URL(urlToAdd);
    } catch {
      toast.error('O link fornecido não é um URL válido.');
      return;
    }
    
    addSocialMedia({
      type: newSocialType,
      url: urlToAdd,
    });
    
    setNewSocialUrl('');
    toast.success('Rede social adicionada com sucesso');
  };

  const handleUpdateSocial = () => {
    if (!editingSocial) return;
    
    // Adjust URL to add https:// if missing
    let urlToUpdate = editingSocial.url.trim();
    if (!urlToUpdate.startsWith('http://') && !urlToUpdate.startsWith('https://')) {
      urlToUpdate = 'https://' + urlToUpdate;
      toast('Prefixo "https://" adicionado automaticamente ao link.');
    }
    
    // Basic URL validation with try-catch
    try {
      new URL(urlToUpdate);
    } catch {
      toast.error('O link fornecido não é um URL válido.');
      return;
    }
    
    updateSocialMedia(editingSocial.id, {
      url: urlToUpdate,
    });
    
    setEditingSocial(null);
    toast.success('Rede social atualizada');
  };

  const handleDeleteSocial = (id: string) => {
    deleteSocialMedia(id);
    if (editingSocial?.id === id) {
      setEditingSocial(null);
    }
    toast.success('Rede social removida');
  };

  const getSocialIcon = (type: SocialMedia['type']) => {
    switch (type) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getSocialName = (type: SocialMedia['type']) => {
    switch (type) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'youtube':
        return 'YouTube';
      case 'other':
        return 'Outro';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalização</CardTitle>
        <CardDescription>
          Personalize a aparência do formulário e compartilhe com seus pacientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Nome da Clínica</Label>
            <Input 
              id="clinicName" 
              value={clinicName} 
              onChange={e => setClinicName(e.target.value)} 
              placeholder="Nome da sua clínica"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo da Clínica</Label>
            
            {/* Logo preview */}
            {(previewLogo || logoUrl) && (
              <div className="relative w-full h-24 mb-3 border rounded-md flex items-center justify-center bg-gray-50">
                <img 
                  src={previewLogo || logoUrl} 
                  alt="Logo preview" 
                  className="max-h-20 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/local-placeholder/150x60-logo-invalido.png';
                  }}
                />
                {previewLogo && (
                  <button 
                    type="button"
                    onClick={clearPreview}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
            
            {/* File upload option */}
            <div className="flex flex-col md:flex-row gap-2">
              <Button 
                type="button" 
                onClick={triggerFileInput} 
                variant="outline" 
                className="flex-1"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? 'Enviando...' : 'Enviar logo'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              
              <div className="flex-1">
                <Input 
                  id="logoUrl" 
                  value={logoUrl} 
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="https://exemplo.com/seu-logo.png"
                  disabled={!!previewLogo}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Envie uma imagem do seu dispositivo ou cole o link de uma imagem online
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor Principal</Label>
            <div className="flex gap-2">
              <Input 
                id="primaryColor" 
                value={primaryColor} 
                onChange={e => setPrimaryColor(e.target.value)} 
                placeholder="#0ea5e9"
              />
              <div 
                className="w-10 h-10 rounded-md border" 
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Código hexadecimal da cor (ex: #0ea5e9)
            </p>
          </div>
          
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardHeader className="pt-6 pb-0">
        <CardTitle>Redes Sociais</CardTitle>
        <CardDescription>
          Adicione ou edite as redes sociais da sua clínica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Media List */}
        <div className="space-y-3">
          {branding.socialMedia.map(social => (
            <div key={social.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: branding.primaryColor }}
                >
                  {getSocialIcon(social.type)}
                </div>
                <div>
                  <p className="font-medium">{getSocialName(social.type)}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[250px]">
                    {social.url}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingSocial?.id === social.id ? (
                  <>
                    <Input
                      value={editingSocial.url}
                      onChange={(e) => setEditingSocial({...editingSocial, url: e.target.value})}
                      placeholder="https://..."
                      className="w-40 sm:w-56"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleUpdateSocial}
                    >
                      Salvar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setEditingSocial(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingSocial({id: social.id, url: social.url})}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteSocial(social.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {branding.socialMedia.length === 0 && (
            <div className="text-center py-4 border rounded-md bg-gray-50">
              <p className="text-gray-500">Nenhuma rede social adicionada</p>
            </div>
          )}
        </div>
        
        {/* Add New Social Media */}
        <div className="pt-4 border-t">
          <p className="font-medium text-sm mb-3">Adicionar Nova Rede Social</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newSocialType}
              onChange={(e) => setNewSocialType(e.target.value as SocialMedia['type'])}
              className="h-10 rounded-md border border-input px-3 bg-background text-sm"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="other">Outro</option>
            </select>
            
            <Input
              value={newSocialUrl}
              onChange={(e) => setNewSocialUrl(e.target.value)}
              placeholder="https://www.instagram.com/suaclinica"
              className="flex-1"
            />
            
            <Button type="button" onClick={handleAddSocial}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardHeader className="pt-6 pb-0">
        <CardTitle>Compartilhar Link</CardTitle>
        <CardDescription>
          Copie o link para compartilhar com seus pacientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex">
            <Input 
              readOnly 
              value={appUrl}
              className="rounded-r-none"
            />
            <Button 
              onClick={copyLink}
              variant="outline" 
              className="rounded-l-none"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Button 
            onClick={copyWhatsAppLink}
            variant="outline" 
            className="w-full"
          >
            Copiar link para WhatsApp
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            Link pronto com mensagem para enviar aos pacientes
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
