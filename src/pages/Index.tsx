import { useAuth } from '@/contexts/AuthContext';
import { LandingPage } from './LandingPage';
import { Dashboard } from './Dashboard';

const Index = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to their dashboard
  if (user) {
    return <Dashboard />;
  }

  // Otherwise show the landing page
  return <LandingPage />;
};

export default Index;
