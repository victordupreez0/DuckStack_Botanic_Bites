import React, { useState } from 'react';
import Stepper, { Step } from './stepper';
import { Link } from 'react-router-dom';

function LogIn() {
  const [name, setName] = useState('');
  return (
      <div className="relative bg-black min-h-screen w-full flex items-center justify-center">
        {/* Full screen background image with 80% opacity */}
        <img
          src={"/src/assets/plantsBG.jpeg"}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
          style={{ pointerEvents: 'none' }}
        />
        <div className="relative z-10 w-full flex items-center justify-center">
          <Stepper
  initialStep={1}
  onStepChange={(step) => {
    console.log(step);
  }}
  onFinalStepCompleted={() => console.log("All steps completed!")}
  backButtonText="Previous"
  nextButtonText="Next"
>
  <Step>
    <h6 className="text-2xl mb-5">Log In</h6>
   <label className="input validator m-2">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </g>
  </svg>
  <input type="Email" placeholder="mail@site.com" required />
</label>

<label className="input m-2">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      ></path>
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
    </g>
  </svg>
  <input
    type="password"
    required
    placeholder="Password"
    minlength="8"
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
  />
</label>

<h2 className="mt-10">Don't have an account? <Link to="/SignUp" className="font-bold underline">Sign Up</Link></h2>

  </Step>

  <Step>
    <h2>Success!</h2>
  </Step>
 
</Stepper>
      </div>
    </div>
  );
}

export default LogIn;