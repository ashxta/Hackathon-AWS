import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import StarryBackground from "@/components/StarryBackground";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <StarryBackground />
      <Navbar />
      <Hero />
      <Dashboard />
    </div>
  );
};

export default Index;