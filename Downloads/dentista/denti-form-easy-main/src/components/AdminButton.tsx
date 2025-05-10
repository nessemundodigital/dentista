
import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginDialog from './LoginDialog';

const AdminButton = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowLoginDialog(true)}
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
        aria-label="Admin Panel"
      >
        <Settings className="h-5 w-5 text-white" />
      </Button>
      
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </>
  );
};

export default AdminButton;
