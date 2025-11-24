"use client";

import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import { locationsDB } from "@/lib/localdb";
import { useLiveQuery } from "dexie-react-hooks";
import { DeleteUserLocation } from "@/data/users";
import { GetUser } from "@/actions/user";

type location = Prisma.LocationGetPayload<{
  include: {
    place: true;
    course: true;
  };
}>;

type WalkedButtonProps = {
  location: location;
};

const WalkedButton: React.FC<WalkedButtonProps> = ({ location }) => {
  const [pending, setPending] = useState(false);
  const items = useLiveQuery(() => locationsDB.items.toArray()) || [];

  console.log(items);

  const handleClick = async () => {
    setPending(true);
    const user = await GetUser().catch((err) => null);
    if (items?.some((loc) => loc.id === location.id)) {
      locationsDB.items.delete(location.id);
      if (user?.id)
        await DeleteUserLocation({
          id: location.id,
          user: user.id,
        }).catch(() => null);
    } else {
      locationsDB.items.add({ id: location.id });
    }

    setTimeout(() => setPending(false), 500); // 0.5秒後に元に戻す（必要に応じて調整）
  };

  let buttonClass = "py-1.5 px-3 text-sm font-medium text-white rounded-full";
  if (pending) {
    buttonClass += " bg-sky-500";
  } else if (!!items?.some((loc) => loc.id === location.id) || false) {
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
