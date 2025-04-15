"use client";

import Image from "next/image";
import { useState } from "react";

const InterviewImage = ({ company }: { company: string }) => {

  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${company}.com`);

  return (
    <Image
      src={imgSrc}
      alt="cover-image"
      width={90}
      height={90}
      className="rounded-full object-fit size-[90px]"
      onError={() => setImgSrc("/company-logo.png")}
    />
  );
};

export default InterviewImage;
