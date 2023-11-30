import { useAtom } from "jotai";
import { storageAtom } from "../store";
import { raviger } from "@kacker/ui";

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
        <div className="flex flex-col justify-between h-full pb-20 pt-[calc(var(--status-bar-height,0))]">
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
            <div className="p-4 text-center">
                <raviger.Link
                    href="https://github.com/skks1212/dhanriti"
                    className="text-blue-500"
                    target="_blank"
                >
                    <i className="fab fa-github" /> Contribute
                </raviger.Link>
            </div>
        </div>
    );
}
