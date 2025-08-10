import { DemoAuthService, DemoUser } from '../lib/demoAuth';

interface HeaderProps {
  user?: DemoUser | null;
  onSignOut?: () => void;
  onNavigate?: (section: string) => void;
}

export default function Header({ user, onSignOut, onNavigate }: HeaderProps) {
  const handleSignOut = () => {
    DemoAuthService.logout();
    onSignOut?.();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">InnoSpot</span>
          </div>
          
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm text-gray-600">
                Welcome, {user.firstName}
              </div>
              <button 
                onClick={handleSignOut}
                className="text-blue-600 text-sm hover:underline"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate?.('register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Register
              </button>
              <div className="text-sm text-gray-600">
                Already Registered?
              </div>
              <button 
                onClick={() => onNavigate?.('login')}
                className="text-blue-600 text-sm hover:underline"
              >
                👤 Sign in
              </button>
            </>
          )}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <span>LinkedIn</span>
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <span>ORCID</span>
          </button>
        </div>
      </div>
    </div>
  );
}