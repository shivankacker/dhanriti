import { useAtom } from "jotai";
import { storageAtom } from "../store";

export default function AccountPage() {
    const [storage, setStorage] = useAtom(storageAtom);

    const handleLogout = () => {
        setStorage({
            ...storage,
            user: undefined,
            auth_token: undefined,
        });
    };

    return (
        <div className="">
            <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="bg-secondary rounded-full text-4xl flex items-center justify-center w-24 h-24">
                    <i className="fad fa-user" />
                </div>
                <div className="text-2xl font-extrabold">
                    {storage?.user?.full_name || "User"}
                </div>
                <div className="text-sm text-gray-500">
                    {storage?.user?.email}
                </div>
                <button className="text-red-500 mt-4" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
