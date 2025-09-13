import { signIn } from "@/auth";
import { FaGoogle, FaLine } from "react-icons/fa";

export default function Auth() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-center p-2">アカウント登録</h1>
        <ul className="list-disc list-inside p-2">
          <li className="p-2">
            ログインするとデータ保存できるようになります。
          </li>
          <li className="p-2">
            ログインしても今までのデータは受け継がれます。
          </li>
        </ul>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <form
          className="flex-1"
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="p-2 border-2 border-gray-400 w-full rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FaGoogle className="w-[1.25em] h-[1.25em]" />
            Googleでログイン
          </button>
        </form>
        <form
          className="flex-1"
          action={async () => {
            "use server";
            await signIn("line");
          }}
        >
          <button
            type="submit"
            className="p-2 border-2 border-gray-400 w-full rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FaLine className="w-[1.25em] h-[1.25em]" />
            LINEでログイン
          </button>
        </form>
      </div>
    </div>
  );
}
