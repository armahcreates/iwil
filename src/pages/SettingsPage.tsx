import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Zap,
  Database,
  Key,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'push' | 'sms';
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  organization: string;
  timezone: string;
  language: string;
  avatar: string;
}

export const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Jennifer',
    lastName: 'Benson',
    email: 'jennifer.benson@iwil.com',
    phone: '+1 (555) 123-4567',
    title: 'Senior Wellness Practitioner',
    organization: 'IWIL Wellness Center',
    timezone: 'America/Los_Angeles',
    language: 'en-US',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2b6c6f165b2b?w=150&h=150&fit=crop&crop=face'
  });

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'new-reports',
      title: 'New Reports',
      description: 'Get notified when new reports are generated',
      enabled: true,
      type: 'email'
    },
    {
      id: 'appointments',
      title: 'Appointment Reminders',
      description: 'Receive reminders for upcoming appointments',
      enabled: true,
      type: 'push'
    },
    {
      id: 'client-updates',
      title: 'Client Updates',
      description: 'Notifications about client progress and milestones',
      enabled: false,
      type: 'email'
    },
    {
      id: 'system-alerts',
      title: 'System Alerts',
      description: 'Important system notifications and maintenance updates',
      enabled: true,
      type: 'push'
    },
    {
      id: 'weekly-summary',
      title: 'Weekly Summary',
      description: 'Weekly digest of your practice analytics',
      enabled: true,
      type: 'email'
    }
  ]);

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure notification preferences',
      icon: Bell,
      color: 'bg-green-500'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Password and security settings',
      icon: Shield,
      color: 'bg-red-500'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the interface',
      icon: Palette,
      color: 'bg-purple-500'
    },
    {
      id: 'data',
      title: 'Data & Privacy',
      description: 'Export, import, and privacy settings',
      icon: Database,
      color: 'bg-orange-500'
    }
  ];

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
    setUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to backend
    setUnsavedChanges(false);
    // Show success message
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <img 
          src={userProfile.avatar} 
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">
            {userProfile.firstName} {userProfile.lastName}
          </h3>
          <p className="text-gray-600">{userProfile.title}</p>
          <p className="text-sm text-gray-500">{userProfile.organization}</p>
        </div>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Change Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name
          </label>
          <Input
            value={userProfile.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name
          </label>
          <Input
            value={userProfile.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              value={userProfile.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="pl-10 border-gray-200 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="tel"
              value={userProfile.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="pl-10 border-gray-200 focus:ring-slate-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title
          </label>
          <Input
            value={userProfile.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Organization
          </label>
          <Input
            value={userProfile.organization}
            onChange={(e) => handleProfileChange('organization', e.target.value)}
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={userProfile.timezone}
            onChange={(e) => handleProfileChange('timezone', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Language
          </label>
          <select
            value={userProfile.language}
            onChange={(e) => handleProfileChange('language', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-800">
            Configure how and when you want to receive notifications about your practice.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {notification.type.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
            </div>
            <Switch
              checked={notification.enabled}
              onCheckedChange={() => handleNotificationToggle(notification.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Keep your account secure by using a strong password and enabling two-factor authentication.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              className="pr-10 border-gray-200 focus:ring-slate-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <Input
            type="password"
            placeholder="Enter new password"
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <Input
            type="password"
            placeholder="Confirm new password"
            className="border-gray-200 focus:ring-slate-500 focus:border-transparent"
          />
        </div>

        <Button className="iwil-gradient text-white">
          <Key className="mr-2 h-4 w-4" />
          Update Password
        </Button>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">
            Enable 2FA
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Theme Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Light', 'Dark', 'Auto'].map((theme) => (
            <div key={theme} className="p-4 border-2 border-gray-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${theme === 'Light' ? 'bg-white border-2 border-gray-300' : theme === 'Dark' ? 'bg-gray-900' : 'bg-gradient-to-r from-white to-gray-900'}`} />
                <span className="text-sm font-medium">{theme}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {theme === 'Light' ? 'Clean and bright interface' : 
                 theme === 'Dark' ? 'Easy on the eyes' : 
                 'Follows system preference'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Display Options</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Compact Mode</p>
              <p className="text-sm text-gray-600">Show more content in less space</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Animations</p>
              <p className="text-sm text-gray-600">Enable smooth transitions and effects</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">High Contrast</p>
              <p className="text-sm text-gray-600">Improve visibility for accessibility</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Data Management</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Download className="h-5 w-5 text-green-600" />
                <h5 className="font-semibold text-green-900">Export Data</h5>
              </div>
              <p className="text-sm text-green-800 mb-4">
                Download all your data in a portable format
              </p>
              <Button size="sm" variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Upload className="h-5 w-5 text-blue-600" />
                <h5 className="font-semibold text-blue-900">Import Data</h5>
              </div>
              <p className="text-sm text-blue-800 mb-4">
                Import data from other systems or backups
              </p>
              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Import Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Analytics Tracking</p>
              <p className="text-sm text-gray-600">Help improve the platform with usage analytics</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-600">Receive updates about new features and tips</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h5 className="font-semibold text-red-900">Danger Zone</h5>
          </div>
          <p className="text-sm text-red-800 mb-4">
            These actions are permanent and cannot be undone.
          </p>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'data':
        return renderDataSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8 iwil-gradient-subtle min-h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 md:w-12 md:h-12 iwil-gradient rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold iwil-gradient-text">Settings</h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
        {unsavedChanges && (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
            <Button 
              onClick={handleSaveChanges}
              className="iwil-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <nav className="space-y-1">
                {settingsSections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-slate-100 border-r-4 border-slate-600 text-slate-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        activeSection === section.id ? section.color + ' text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{section.title}</p>
                        <p className="text-xs text-gray-500">{section.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {(() => {
                  const section = settingsSections.find(s => s.id === activeSection);
                  const IconComponent = section?.icon || SettingsIcon;
                  return (
                    <>
                      <IconComponent className="h-5 w-5 text-slate-600" />
                      <span>{section?.title}</span>
                    </>
                  );
                })()}
              </CardTitle>
              <CardDescription>
                {settingsSections.find(s => s.id === activeSection)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSectionContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
