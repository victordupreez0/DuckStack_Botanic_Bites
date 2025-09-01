import React from 'react';
import BlurText from '../UI/headerText'

const Header = () => {
  return (
  <header
  className="w-full flex  flex-col items-center h-[100vh] bg-cover bg-center"
  style={{ backgroundImage: 'url(/cover.png)' }}
>
  <BlurText
    text="Botanic Bites"
    delay={150}
    animateBy="words"
    direction="top"
    className="text-[80px] font-bold md:text-[150px] text-center leading-[1.1] mt-20 inline-block"
  />
</header>);
};

export default Header;