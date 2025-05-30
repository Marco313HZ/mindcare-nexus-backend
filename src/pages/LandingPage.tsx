
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ContactForm } from '@/components/ContactForm';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Clock, MapPin, Phone, Mail } from 'lucide-react';

interface ContactInfo {
  location: string;
  phone_number: string;
  email: string;
  office_hours: string;
}

export const LandingPage = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/contact-us');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data[0]); // Assuming we get an array with the first item being the contact info
      }
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    }
  };

  const services = [
    {
      icon: <Heart className="h-8 w-8 text-blue-600" />,
      title: "Individual Therapy",
      description: "One-on-one sessions with licensed therapists specializing in various mental health conditions."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Group Therapy",
      description: "Connect with others facing similar challenges in a supportive group environment."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Crisis Support",
      description: "24/7 emergency support for individuals experiencing mental health crises."
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: "Flexible Scheduling",
      description: "Evening and weekend appointments available to fit your busy lifestyle."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Professional Mental Health Care
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Journey to
              <span className="text-blue-600"> Mental Wellness</span>
              <br />
              Starts Here
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive psychiatric care with compassionate professionals dedicated to helping you achieve mental wellness and emotional balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of mental health services tailored to meet your individual needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About MindCare Center
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                For over a decade, MindCare Center has been a beacon of hope for individuals seeking mental health support. Our team of licensed psychiatrists, psychologists, and therapists are committed to providing evidence-based treatment in a warm, welcoming environment.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that mental health is just as important as physical health, and everyone deserves access to quality care. Our comprehensive approach combines traditional therapy with innovative treatment methods to help you achieve lasting wellness.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1000+</div>
                  <div className="text-gray-600">Patients Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-3" />
                    Licensed and experienced professionals
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 text-red-600 mr-3" />
                    Compassionate, patient-centered care
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    Comprehensive treatment programs
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-orange-600 mr-3" />
                    Flexible scheduling options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your journey to better mental health? Contact us today to schedule an appointment or learn more about our services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">Contact Information</h3>
              
              {contactInfo && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600">{contactInfo.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone</h4>
                      <p className="text-gray-600">{contactInfo.phone_number}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">{contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Office Hours</h4>
                      <p className="text-gray-600">{contactInfo.office_hours}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">MindCare Center</h3>
            <p className="text-gray-400 mb-4">
              Professional mental health care for a healthier, happier you.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 MindCare Center. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};
