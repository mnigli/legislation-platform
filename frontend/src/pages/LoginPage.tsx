import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Initialize Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      (window as any).google?.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id',
        callback: handleCredentialResponse,
      });

      (window as any).google?.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          locale: 'he',
          width: 320,
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await login(response.credential);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">⚖️ חוקית</h1>
        <p className="text-gray-500 mb-8">היכנסו כדי לדרג הצעות חוק, להגיב ולהציע שיפורים</p>

        <div className="flex justify-center mb-6">
          <div id="google-signin-btn" />
        </div>

        <div className="text-sm text-gray-400 space-y-2">
          <p>הכניסה מתבצעת באמצעות חשבון גוגל בלבד</p>
          <p>לאחר ההרשמה תידרשו לאמת את כתובת המייל כדי למנוע בוטים</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="font-medium mb-3 text-gray-700">למה להירשם?</h3>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg">⭐</span>
              <p>דרגו הצעות חוק</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg">💡</span>
              <p>הציעו שיפורים</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg">💬</span>
              <p>הגיבו ודונו</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg">🏆</span>
              <p>צברו תגים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
