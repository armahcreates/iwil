import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, CheckCircle, Stethoscope, User, Shield, Heart, Brain, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { IWILLogo } from '../components/ui/iwil-logo-svg';

interface DemoAccount {
  name: string;
  email: string;
  password: string;
  role: string;
  organization: string;
  icon: React.ReactNode;
  description: string;
}

const demoAccounts: DemoAccount[] = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@iwilprotocol.com',
    password: 'demo123456',
    role: 'Doctor',
    organization: 'IWIL Medical Center',
    icon: <Stethoscope className="h-5 w-5" />,
    description: 'Primary care physician with full access to patient reports and medical protocols'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@iwilprotocol.com',
    password: 'demo123456',
    role: 'Nutritionist',
    organization: 'IWIL Wellness Clinic',
    icon: <Heart className="h-5 w-5" />,
    description: 'Certified nutritionist specializing in wellness protocols and dietary assessments'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@iwilprotocol.com',
    password: 'demo123456',
    role: 'Nurse',
    organization: 'IWIL Health Services',
    icon: <User className="h-5 w-5" />,
    description: 'Registered nurse managing patient care and health monitoring protocols'
  },
  {
    name: 'Dr. James Wilson',
    email: 'james.wilson@iwilprotocol.com',
    password: 'demo123456',
    role: 'Therapist',
    organization: 'IWIL Therapy Center',
    icon: <Brain className="h-5 w-5" />,
    description: 'Licensed therapist providing mental health and wellness therapy services'
  },
  {
    name: 'Lisa Thompson',
    email: 'lisa.thompson@iwilprotocol.com',
    password: 'demo123456',
    role: 'Wellness Coach',
    organization: 'IWIL Wellness Institute',
    icon: <Users className="h-5 w-5" />,
    description: 'Certified wellness coach helping clients achieve their health and fitness goals'
  },
  {
    name: 'Admin User',
    email: 'admin@iwilprotocol.com',
    password: 'admin123456',
    role: 'Administrator',
    organization: 'IWIL Protocol HQ',
    icon: <Shield className="h-5 w-5" />,
    description: 'System administrator with full access to all platform features and settings'
  }
];

export function DemoCredentialsPage() {
  const [copiedField, setCopiedField] = useState<string>('');

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const seedDemoData = async () => {
    try {
      const response = await fetch('/api/seed-demo-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Demo data seeded successfully! Created ${data.summary.created} accounts.`);
      } else {
        alert('Failed to seed demo data. Please try again.');
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      alert('Error seeding demo data. Please check the console.');
    }
  };

  return (
    <div className="min-h-screen iwil-gradient-subtle px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-3 sm:mb-4">
            <IWILLogo size={56} className="sm:w-16 sm:h-16" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">IWIL Protocol Demo Credentials</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 px-4 sm:px-0">
            Use these demo accounts to explore the IWIL Protocol healthcare management system
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button onClick={seedDemoData} className="iwil-gradient text-white h-12 sm:h-auto text-base sm:text-sm touch-manipulation">
              Seed Demo Data
            </Button>
            <Link to="/login">
              <Button variant="outline" className="h-12 sm:h-auto text-base sm:text-sm touch-manipulation">Go to Login</Button>
            </Link>
          </div>
        </div>

        {/* Demo Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {demoAccounts.map((account, index) => (
            <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
                  {account.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{account.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">{account.role}</p>
                  <p className="text-xs text-gray-500 truncate">{account.organization}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">{account.description}</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 text-xs sm:text-sm bg-gray-100 px-2 py-2 sm:py-1 rounded text-gray-800 break-all">
                      {account.email}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.email, `email-${index}`)}
                      className="p-2 sm:p-1 text-gray-400 hover:text-gray-600 touch-manipulation"
                    >
                      {copiedField === `email-${index}` ? (
                        <CheckCircle className="h-4 w-4 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="flex-1 text-xs sm:text-sm bg-gray-100 px-2 py-2 sm:py-1 rounded text-gray-800">
                      {account.password}
                    </code>
                    <button
                      onClick={() => copyToClipboard(account.password, `password-${index}`)}
                      className="p-2 sm:p-1 text-gray-400 hover:text-gray-600 touch-manipulation"
                    >
                      {copiedField === `password-${index}` ? (
                        <CheckCircle className="h-4 w-4 sm:h-4 sm:w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Seed Demo Data</h3>
              <p className="text-gray-600 text-sm mb-4">
                Click the "Seed Demo Data" button above to create all demo accounts in the database.
                This only needs to be done once.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">2. Choose an Account</h3>
              <p className="text-gray-600 text-sm mb-4">
                Select any demo account above based on the role you want to explore. Each role has
                different permissions and access levels.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Login</h3>
              <p className="text-gray-600 text-sm mb-4">
                Copy the email and password, then go to the login page to access the IWIL Protocol
                dashboard with full functionality.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">4. Explore Features</h3>
              <p className="text-gray-600 text-sm">
                Once logged in, explore client management, report generation, templates, calendar
                scheduling, and other healthcare management features.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            IWIL Protocol Demo Environment • HIPAA-Compliant • Secure Healthcare Management
          </p>
        </div>
      </div>
    </div>
  );
}
