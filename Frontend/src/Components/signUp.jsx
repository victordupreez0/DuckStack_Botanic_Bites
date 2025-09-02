import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Stepper, { Step } from './stepper';

function SignUp() {
  const profileImages = [
    'https://i.guim.co.uk/img/media/b219034a3fd5933aa18ed7d0bcbc723d0c2d0846/0_611_3412_2047/master/3412.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=9e8d4463ae89981a4ca00e3b807d7421',
    'https://www.shutterstock.com/image-photo/closeup-venus-flytrap-insectivorous-plants-600nw-2474016693.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2GWxiYfbHy1dUyKYy_k_bfTD7cg_2r777yw&s',
    'https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24724370/B88A7771.jpeg?quality=90&strip=all&crop=0.009170946441678,0,99.981658107117,100',
    'https://www.thoughtco.com/thmb/9ToT07iB1NWHAZOnCobUbRFHAEk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/venus-fly-trap-2-533d86a86c014c3b84ab7cad363d94a1.jpg',
    'https://images.squarespace-cdn.com/content/v1/54fbb611e4b0d7c1e151d22a/de308924-0a0e-4528-b559-c6b5d9cb61a5/Carnivorous-Pitcher-Plants-North-Carolina.jpg',
    'https://allthatsinteresting.com/wordpress/wp-content/uploads/2013/12/carnivorous-plants-butterwort.jpg',
    'https://cdn.mos.cms.futurecdn.net/WWSeFixpHqc5i5CaYD4T3m.jpg',
    'https://www.allianceforthebay.org/wp-content/uploads/2020/10/carn-1.jpg'
  ];
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    username: '',
    reseller: false,
    profileImg: profileImages[0]
  });
  const [showImgGrid, setShowImgGrid] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      // Always stay on last step so message displays
      setStep(3);
      if (res.ok) {
        setMessage('Signup successful!');
        // Auto-login after signup with selected profile image
        localStorage.setItem('user', JSON.stringify({
          email: form.email,
          profileImg: form.profileImg
        }));
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (err) {
      setStep(3);
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
            if (newStep === 3) handleFinalStep();
          }}
          onFinalStepCompleted={() => {}}
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
            <div className="avatar flex flex-col items-center relative">
              <div className="w-24 h-24 rounded-full mb-2 cursor-pointer border-4 border-[#A07856] flex items-center justify-center" onClick={() => setShowImgGrid(true)}>
                <img src={form.profileImg} alt="Profile" className="w-24 h-24 rounded-full" />
              </div>
              {showImgGrid && (
                <div className="fixed inset-0 z-100 flex items-center justify-center" onClick={() => setShowImgGrid(false)}>
                  <div
                    className="bg-black bg-opacity-80 rounded-xl p-0 grid grid-cols-3 gap-0 shadow-2xl"
                    style={{ width: '240px', height: '240px', position: 'fixed', top: '0', left: '0', transform: 'translate(-10%, -30%)', overflow: 'hidden' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {profileImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Profile ${i+1}`}
                        className="w-full h-full object-cover aspect-square cursor-pointer border-0 transition-transform duration-200 ease-out hover:-translate-y-2"
                        onClick={() => {
                          setForm(prev => ({ ...prev, profileImg: img }));
                          setShowImgGrid(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
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
            <h2 className={message ? "" : "invisible"} style={{ color: 'white', marginTop: '1em', textAlign: 'center' }}>{message || 'Done!'}</h2>
          </Step>
        </Stepper>
        {/* Message now only shown in last step, not outside Stepper */}
      </div>
    </div>
  );
}

export default SignUp;