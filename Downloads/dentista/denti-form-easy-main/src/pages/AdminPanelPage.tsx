
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import PatientList from '@/components/PatientList';
import BrandingSettings from '@/components/BrandingSettings';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Menu, X, Archive, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';

const AdminPanelPage = () => {
  const { branding, patients, clearOldPatients, isLoading } = useApp();
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // For the demo, we'll just use a simple authentication
    // In a real app, this would involve proper auth
    return localStorage.getItem('dentalAdminAuth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple password for demo purposes - in a real app, use proper auth
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('dentalAdminAuth', 'true');
      setIsAuthenticated(true);
    } else {
      toast.error('Senha incorreta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dentalAdminAuth');
    setIsAuthenticated(false);
  };

  const redirectToPatientForm = () => {
    window.location.href = '/';
  };

  const handleShare = () => {
    const shareUrl = window.location.origin + '/?shared=true';
    if (navigator.share) {
      navigator.share({
        title: branding?.clinicName || 'Clínica Odontológica',
        text: 'Agende sua consulta na nossa clínica!',
        url: shareUrl,
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback: copiar link para clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast.success('Link copiado para a área de transferência!');
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 shadow-lg border-t-4 border-t-primary animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso ao Painel</h1>
            <p className="text-sm text-gray-500">Administração da Clínica</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite a senha de acesso"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Acessar Painel
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Para demonstração, use: admin123</p>
          </div>
          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={redirectToPatientForm} size="sm">
              Voltar para o formulário
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">Carregando dados</h2>
          <p className="text-gray-500">Por favor, aguarde enquanto carregamos as informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <header className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={branding?.logoUrl || 'https://via.placeholder.com/100x40?text=Logo'} 
              alt={branding?.clinicName || 'Clínica'} 
              className="h-10 mr-3 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/100x40?text=Logo';
              }}
            />
            <h1 
              className="text-xl font-bold hidden sm:block" 
              style={{color: branding?.primaryColor || '#0ea5e9'}}
            >
              {branding?.clinicName || 'Clínica'} - Painel
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative z-20"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={clearOldPatients} size="sm" className="hidden sm:flex">
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar Antigos
                </Button>
                <Button variant="outline" onClick={redirectToPatientForm} size="sm" className="hidden sm:flex">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Ver Formulário
                </Button>
                <Button variant="outline" onClick={handleShare} size="sm">
                  Compartilhar
                </Button>
                <Button variant="ghost" onClick={handleLogout} size="sm">
                  Sair
                </Button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Mobile menu overlay */}
      {isMobile && mobileMenuOpen && (
  <div className="fixed inset-0 bg-white z-10 p-4 pt-20 animate-fade-in">
    <div className="flex flex-col space-y-4">
      <Button 
        variant="outline" 
        onClick={clearOldPatients} 
        className="w-full justify-start"
      >
        <Archive className="h-4 w-4 mr-2" />
        Arquivar Pacientes Antigos
      </Button>
      <Button 
        variant="outline" 
        onClick={redirectToPatientForm} 
        className="w-full justify-start"
      >
        <ArrowLeftRight className="h-4 w-4 mr-2" />
        Ver Formulário
      </Button>
      <Button 
        variant="outline" 
        onClick={handleShare} 
        className="w-full justify-start"
      >
        Compartilhar
      </Button>
      <Button 
        variant="ghost" 
        onClick={handleLogout} 
        className="w-full justify-start"
      >
        Sair
      </Button>
    </div>
  </div>
)}

      <div className={`container mx-auto px-4 py-6 ${mobileMenuOpen && isMobile ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 text-transparent bg-clip-text">
            Painel do Dentista
          </h1>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
              {patients?.length || 0} pacientes
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearOldPatients}
              className="sm:hidden"
            >
              <Archive className="h-4 w-4 mr-1" />
              Arquivar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="patients" className="flex-1">Pacientes</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="patients" className="space-y-4">
            <PatientList />
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BrandingSettings />
              <div className="space-y-4">
                <Card className="border-l-4 border-l-cyan-500">
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-medium mb-4">Ajuda e Suporte</h2>
                    <p className="text-gray-600 mb-4">
                      Este é um aplicativo simples para gerenciar pacientes da sua clínica odontológica.
                      Compartilhe o link do formulário com seus pacientes através do WhatsApp, Instagram
                      ou em anúncios online.
                    </p>
                    <h3 className="font-medium mb-2">Como usar:</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-600">
                      <li>Personalize o nome e logo da sua clínica em "Configurações"</li>
                      <li>Copie o link do formulário e compartilhe com seus pacientes</li>
                      <li>Pacientes preenchem o formulário com seus dados</li>
                      <li>Visualize os dados recebidos na aba "Pacientes"</li>
                      <li>Atualize o status dos pacientes conforme necessário</li>
                    </ol>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium mb-2 text-amber-600">Gerenciamento de Armazenamento</h4>
                      <p className="text-gray-600 mb-3">
                        Para evitar problemas de armazenamento, você pode arquivar pacientes antigos:
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={clearOldPatients} 
                        className="w-full"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Arquivar Pacientes Antigos
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Isso manterá apenas os 10 pacientes mais recentes no sistema.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex sm:hidden">
                  <Button onClick={redirectToPatientForm} className="w-full">
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Ver Formulário
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanelPage;
