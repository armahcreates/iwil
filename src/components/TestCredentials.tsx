import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, User, Lock } from 'lucide-react';

interface TestCredential {
  email: string;
  password: string;
  role: string;
  name: string;
  description: string;
}

const testCredentials: TestCredential[] = [
  {
    email: 'demo@iwil.com',
    password: 'demo123',
    role: 'staff',
    name: 'Demo User',
    description: 'Standard staff member account'
  },
  {
    email: 'admin@iwil.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    description: 'Administrator account with full access'
  }
];

interface TestCredentialsProps {
  onCredentialSelect?: (email: string, password: string) => void;
}

export function TestCredentials({ onCredentialSelect }: TestCredentialsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUseCredentials = (credential: TestCredential) => {
    if (onCredentialSelect) {
      onCredentialSelect(credential.email, credential.password);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            Test Credentials - Local Development
          </CardTitle>
          <p className="text-sm text-blue-600">
            Use these credentials to test the authentication system in your local development environment.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {testCredentials.map((credential, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{credential.name}</h3>
                  <p className="text-sm text-gray-600">{credential.description}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    Role: {credential.role}
                  </span>
                </div>
                {onCredentialSelect && (
                  <Button
                    onClick={() => handleUseCredentials(credential)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Use These
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono">{credential.email}</span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(credential.email)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono">{credential.password}</span>
                  </div>
                  <Button
                    onClick={() => copyToClipboard(credential.password)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> These credentials are for local development only. 
              In production, use proper authentication with secure passwords.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
