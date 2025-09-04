import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from './stepper';
import { Link } from 'react-router-dom';

function LogIn() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalStep = async () => {
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      // Always stay on last step so message displays
      setStep(2);
      if (res.ok) {
        setMessage('Login successful!');
        // Save the user object from backend, including isAdmin
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          ...data.user,
          profileImg: 'https://img.daisyui.com/images/profile/demo/batperson@192.webp'
        }));
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 500);
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (err) {
      setStep(2);
      setMessage('Network error.');
    }
  };

  useEffect(() => {
    const renderGoogle = () => {
      if (!window.google) return;
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || window.__GOOGLE_CLIENT_ID__,
          callback: async (response) => {
            const id_token = response?.credential;
            if (!id_token) return;
            try {
              const res = await fetch('http://localhost:3000/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token })
              });
              const data = await res.json();
              setStep(2);
              if (res.ok && data.token) {
                setMessage('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ ...data.user, profileImg: data.user.profileImg || 'https://img.daisyui.com/images/profile/demo/batperson@192.webp' }));
                setTimeout(() => { navigate('/'); window.location.reload(); }, 500);
              } else {
                setMessage(data.message || 'Google login failed.');
              }
            } catch (err) {
              setStep(2);
              setMessage('Network error.');
            }
          }
        });
        const container = document.getElementById('googleSignInDiv');
        if (container) {
          container.innerHTML = '';
          window.google.accounts.id.renderButton(container, { theme: 'outline', size: 'large' });
        }
      } catch (e) {
        // ignore
      }
    };
    renderGoogle();
    // If google script didn't load or init failed, show hint after 1.5s
    const t = setTimeout(() => {
      if (!window.google) setMessage('Google Sign-In not available (script not loaded or origin not authorized). Check OAuth origins.');
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative bg-black min-h-screen w-full flex items-center justify-center">
      <img
        src={"/src/assets/plantsBG.jpeg"}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        style={{ pointerEvents: 'none' }}
      />
  <div className="relative z-10 w-full flex flex-col items-center justify-center pb-40">
        <Stepper
          initialStep={step}
          onStepChange={(newStep) => {
            setStep(newStep);
            if (newStep === 2) handleFinalStep();
          }}
          onFinalStepCompleted={() => {}}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h6 className="text-2xl mb-5">Log In</h6>
            <label className="input validator m-2">
              {/* ...svg... */}
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="mail@site.com" required />
            </label>
            <label className="input m-2">
              {/* ...svg... */}
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password"
                minLength={8}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
              />
            </label>
            <div className="mt-4 flex w-full">
              <div id="googleSignInDiv" className="m-auto"></div>
            </div>
            <h2 className="mt-6">Don't have an account? <Link to="/SignUp" className="font-bold underline">Sign Up</Link></h2>
          </Step>
          <Step>
            <h2 className={message ? "" : "invisible"} style={{ color: 'white', marginTop: '1em', textAlign: 'center' }}>{message || 'Success!'}</h2>
          </Step>
  </Stepper>
  {/* Message now only shown in last step, not outside Stepper */}
      </div>
    </div>
  );
}

export default LogIn;