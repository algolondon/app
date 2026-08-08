import React from 'react';
import Image from 'next/image';

export const SanityLogo = () => {
  return (
    <Image 
      src="/logo.png" 
      alt="16London X Brands LLC" 
      width={100} 
      height={25} 
      style={{ objectFit: 'contain' }} 
    />
  );
};
