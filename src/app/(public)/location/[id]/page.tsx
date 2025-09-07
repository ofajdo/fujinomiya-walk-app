import { Detail } from "@/components/location/detail";
import { LocationSerchById } from "@/data/locations";
import Link from "next/link";

export default async function Location({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await LocationSerchById({ id: id }).catch(() => null);

  if (!location) return <div className="p-4">見つかりませんでした。</div>;

  return (
    <div>
      <div className="flex gap-2 text-center p-2">
        <Link
          className="flex-1 border-2 border-gray-400 rounded-md p-2"
          href={`/map/${location?.course.id}`}
        >
          マップに戻る
        </Link>
        <Link
          className="flex-1 border-2 border-gray-400 rounded-md p-2"
          href={`/course/${location?.course.id}`}
        >
          コース詳細に戻る
        </Link>
      </div>
      <div className="w-full p-2 bg-gray-100 rounded-xl shadow-md">
        {location && <Detail location={location} />}
      </div>
    </div>
  );
}
