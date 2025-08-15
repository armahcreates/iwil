import { useState, useEffect } from 'react';

interface IWILLogoBlobProps {
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

export function IWILLogoBlob({ size = 64, className = '', fallback }: IWILLogoBlobProps) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        setError('');

        // First try to upload the logo if it doesn't exist
        const uploadResponse = await fetch('/api/upload-logo', {
          method: 'POST',
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          setLogoUrl(uploadData.logoUrl);
        } else {
          // If upload fails, try to get existing logo
          const getResponse = await fetch('/api/upload-logo', {
            method: 'GET',
          });

          if (getResponse.ok) {
            // Create blob URL from SVG content
            const svgContent = await getResponse.text();
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            setLogoUrl(url);
          } else {
            throw new Error('Failed to load logo');
          }
        }
      } catch (err) {
        console.error('Error loading IWIL logo:', err);
        setError(err instanceof Error ? err.message : 'Failed to load logo');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();

    // Cleanup blob URL on unmount
    return () => {
      if (logoUrl && logoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 rounded-full animate-pulse ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
      </div>
    );
  }

  if (error || !logoUrl) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Default fallback with IWIL initials
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold rounded-full ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        IWIL
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="IWIL Protocol Logo"
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError('Failed to display logo')}
    />
  );
}

// Hook for getting the logo URL
export function useIWILLogo() {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/upload-logo', {
          method: 'POST',
        });

        if (response.ok) {
          const data = await response.json();
          setLogoUrl(data.logoUrl);
        } else {
          throw new Error('Failed to load logo');
        }
      } catch (err) {
        console.error('Error loading IWIL logo:', err);
        setError(err instanceof Error ? err.message : 'Failed to load logo');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, []);

  return { logoUrl, isLoading, error };
}
