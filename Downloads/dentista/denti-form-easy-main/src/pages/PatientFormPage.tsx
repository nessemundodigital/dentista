import { useApp } from "context/AppContext";
import PatientForm from "components/PatientForm";
import { DentalIcons } from "components/DentalIcons";
import { Typewriter } from "components/ui/typewriter";
import { Facebook, Instagram, Youtube, Loader2 } from "lucide-react";
import AdminButton from "components/AdminButton";
import { useLocation } from "react-router-dom";

const PatientFormPage = () => {
  const {
    branding,
    isLoading
  } = useApp();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isShared = searchParams.get('shared') === 'true';

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'facebook':
        return <Facebook className="text-white" />;
      case 'instagram':
        return <Instagram className="text-white" />;
      case 'youtube':
        return <Youtube className="text-white" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-medium mb-2">Carregando</h2>
          <p className="text-gray-500">Por favor, aguarde um momento...</p>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      { !isShared && <AdminButton /> }
      
      <div className="relative w-full bg-gradient-to-r from-sky-500 to-cyan-400 overflow-hidden">
        <div className="container mx-auto md:py-12 px-[16px] py-[23px]">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 text-white z-10 mb-6 md:mb-0">
              <div className="flex items-center mb-4 px-0">
                <img src={branding.logoUrl} alt={branding.clinicName} className="h-14 mr-4 object-contain bg-white/90 p-1 rounded" onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://via.placeholder.com/200x80?text=Logo';
              }} />
                <h1 className="md:text-4xl font-bold text-3xl text-left">
                  {branding.clinicName}
                </h1>
              </div>
              <p className="text-xl md:text-2xl mb-2 font-light">
                <Typewriter text={["Sorria com confiança", "Sorria com segurança", "Sorria sem preocupações", "Sorria com saúde"]} speed={70} className="text-white font-medium" waitTime={2000} deleteSpeed={40} cursorChar="_" />
              </p>
              <p className="text-white/80">
                Preencha o formulário abaixo para agendar sua consulta
              </p>
            </div>
            
            <div className="w-full md:w-1/2 relative">
              <div className="aspect-[4/3] relative z-10 rounded-lg overflow-hidden shadow-xl transform md:translate-y-4 border-4 border-white">
                <img src="/lovable-uploads/f30e044b-d064-499d-b8db-038bd28bd18b.png" alt="Paciente no dentista" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-800/40 to-transparent"></div>
              </div>
              <DentalIcons />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,56.44,321.39,56.44z" fill="#ffffff"></path>
          </svg>
        </div>
      </div>

      <div className="container max-w-md mx-auto px-4 -mt-6 md:-mt-12 mb-8 relative z-20">
        <PatientForm />
      </div>

      <footer className="py-6 mt-8 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-gray-600">Siga-nos nas redes sociais</p>
          <div className="flex justify-center space-x-6">
            {branding && branding.socialMedia && branding.socialMedia.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="social-btn" style={{
            backgroundColor: branding.primaryColor
          }} aria-label={social.type}>
                {getSocialIcon(social.type)}
              </a>)}
          </div>
        </div>
        
        <style>{`
          .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            transition: all 0.2s ease;
            transform: translateY(0);
          }
          
          .social-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `}</style>
      </footer>
    </div>;
};
export default PatientFormPage;
