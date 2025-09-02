import React, { useState } from 'react';
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
        localStorage.setItem('user', JSON.stringify({
          email: form.email,
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

  return (
    <div className="relative bg-black min-h-screen w-full flex items-center justify-center">
      <img
        src={"/src/assets/plantsBG.jpeg"}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
        style={{ pointerEvents: 'none' }}
      />
      <div className="relative z-10 w-full flex items-center justify-center">
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
            <h2 className="mt-10">Don't have an account? <Link to="/SignUp" className="font-bold underline">Sign Up</Link></h2>
          </Step>
          <Step>
            <h2 className={message ? "" : "invisible"} style={{ color: 'red', marginTop: '1em' }}>{message || 'Success!'}</h2>
          </Step>
        </Stepper>
        {step === 2 && message && (
          <div style={{ marginTop: '1em', color: 'white', textAlign: 'center' }}>{message}</div>
        )}
      </div>
    </div>
  );
}

export default LogIn;