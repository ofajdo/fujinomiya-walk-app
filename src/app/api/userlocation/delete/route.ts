import { NextRequest, NextResponse } from "next/server";
import { GetUser } from "@/actions/user";
import { DeleteUserLocation } from "@/data/users";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locationId = body.id;

    const user = await GetUser().catch((err) => {
      console.log(err);
      return null;
    });

    if (user?.id && locationId) {
      await DeleteUserLocation({
        id: locationId,
        user: user.id,
      }).catch(() => null);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "User not found or invalid location id" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
