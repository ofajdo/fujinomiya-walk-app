import React, { useState } from "react";

import { Prisma } from "@prisma/client";

type location = Prisma.LocationGetPayload<{
  include: {
    place: true;
    course: true;
  };
}>;

type WalkedButtonProps = {
  location: location;
  onWalked?: (location: location) => void;
  walked: boolean;
};

const WalkedButton: React.FC<WalkedButtonProps> = ({
  location,
  onWalked,
  walked,
}) => {
  const [pending, setPending] = useState(false);

  const handleClick = () => {
    setPending(true); // 仮色に変更
    if (onWalked) {
      onWalked(location);
    }
    setTimeout(() => setPending(false), 500); // 0.5秒後に元に戻す（必要に応じて調整）
  };

  let buttonClass = "py-1.5 px-3 text-sm font-medium text-white rounded-full";
  if (pending) {
    buttonClass += " bg-sky-500";
  } else if (walked) {
    buttonClass += " bg-gray-400";
  } else {
    buttonClass += " bg-blue-600";
  }

  return (
    <button className={buttonClass} onClick={handleClick} disabled={pending}>
      歩いた！
    </button>
  );
};

export default WalkedButton;
