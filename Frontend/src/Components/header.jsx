import React from 'react';
import BlurText from '../UI/headerText';
import Flytrap from '../assets/flytrap.png'; // replace with your own image path

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <header
      className="relative w-full flex flex-col items-center h-[95vh] bg-black bg-cover bg-center"
    >
      <BlurText
        text="Botanic Bites"
        delay={150}
        animateBy="words"
        direction="top"
        className="text-[80px] font-bold md:text-[150px] text-center leading-[1.1] mt-20 z-10"
      />

      {/* Venus flytrap image overlapping text */}
      <img
        src={Flytrap}
        alt="Venus Flytrap"
        className="w-[500px] md:w-[1080px] absolute bottom-0 transform translate-y-[0px] z-30 drop-shadow-[0_-20px_30px_rgba(1,1,1,50)]"
      />
    </header>
  );
};

export default Header;