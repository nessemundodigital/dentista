
import { Smile } from "lucide-react";

export const DentalIcons = () => {
  // Criando versões personalizadas de ícones dentais
  const icons = [
    {
      element: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38643 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C10.6868 22 9.38643 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4Z" fill="currentColor"/>
          <path d="M15.5 9.5C15.5 10.1904 14.9404 10.75 14.25 10.75C13.5596 10.75 13 10.1904 13 9.5C13 8.80964 13.5596 8.25 14.25 8.25C14.9404 8.25 15.5 8.80964 15.5 9.5Z" fill="currentColor"/>
          <path d="M11 9.5C11 10.1904 10.4404 10.75 9.75 10.75C9.05964 10.75 8.5 10.1904 8.5 9.5C8.5 8.80964 9.05964 8.25 9.75 8.25C10.4404 8.25 11 8.80964 11 9.5Z" fill="currentColor"/>
          <path d="M16 15C16 13.8954 14.2091 13 12 13C9.79086 13 8 13.8954 8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      name: "tooth-smile"
    },
    {
      element: <Smile className="rotate-12" />,
      name: "smile"
    },
    {
      element: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.05033 11.293L5.63612 12.7072C4.13398 14.2093 4.13398 16.6447 5.63612 18.1468C7.13825 19.649 9.57359 19.649 11.0757 18.1468L12.4899 16.7326M11.0757 5.63604L12.4899 4.22183C13.9921 2.71969 16.4274 2.71969 17.9296 4.22183C19.4317 5.72396 19.4317 8.1593 17.9296 9.66144L16.5154 11.0757M14.3941 9.66144L9.66147 14.3941" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      name: "dental-tools"
    }
  ];

  return (
    <div className="absolute w-full h-full">
      {icons.map((icon, index) => (
        <div 
          key={icon.name} 
          className={`absolute text-white/30 animate-pulse`}
          style={{
            top: `${15 + (index * 25)}%`,
            left: `${5 + (index * 5)}%`,
            animationDelay: `${index * 0.5}s`,
            transform: `scale(${1 + index * 0.3})`
          }}
        >
          {icon.element}
        </div>
      ))}
      
      {icons.map((icon, index) => (
        <div 
          key={`right-${icon.name}`} 
          className={`absolute text-white/30 animate-pulse`}
          style={{
            top: `${25 + (index * 20)}%`,
            right: `${5 + (index * 5)}%`,
            animationDelay: `${index * 0.7}s`,
            transform: `scale(${1.2 + index * 0.2})`
          }}
        >
          {icon.element}
        </div>
      ))}
    </div>
  );
};
