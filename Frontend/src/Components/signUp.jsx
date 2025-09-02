import React, { useState } from 'react';
import Stepper, { Step } from './stepper';
import { Link } from 'react-router-dom';

function SignUp() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    username: '',
    reseller: false
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFinalStep = async () => {
    setMessage('');
    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful!');
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
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
          onStepChange={setStep}
          onFinalStepCompleted={handleFinalStep}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h6 className="text-2xl mb-5">Sign Up</h6>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input m-2" />
            <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Surname" className="input m-2" />
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
            <h2 className="mt-10">Already have an account? <Link to="/logIn" className="font-bold underline">Log In</Link></h2>
          </Step>
          <Step>
            <h6 className="text-2xl mb-5">Personalise</h6>
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
              </div>
            </div>
            <label className="input validator m-2">
              {/* ...svg... */}
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="Username"
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers or dash"
              />
            </label>
            <fieldset className="fieldset m-6 w-[100%] rounded-box">
              <label className="label">
                <input type="checkbox" name="reseller" checked={form.reseller} onChange={handleChange} className="checkbox" />
                Apply to become a reseller
              </label>
            </fieldset>
          </Step>
          <Step>
            <h2>Done!</h2>
          </Step>
        </Stepper>
        {message && <div style={{ marginTop: '1em', color: 'red' }}>{message}</div>}
      </div>
    </div>
  );
}

export default SignUp;