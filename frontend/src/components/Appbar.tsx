import { Link } from "react-router-dom"

export const Appbar = () => {
    return (
        <div className="border-b flex justify-between px-10 py-5 bg-slate-200">
            <Link to={"/dashboard"} className="flex flex-col justify-center cursor-pointer">
                <div>
                    Expense Tracker
                </div>
            </Link>
            <div>
                <Link to={"/"}>
                    <button onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("name")
                        localStorage.removeItem("email")
                    }} type="button" className="mr-8 text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Logout</button>
                </Link>
                <Avatar size="big" name={localStorage.getItem("name") || ""} />
            </div>
        </div>
    )
}

export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
    return (
        <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-8 h-8" : "w-10 h-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
            <span className={`font-xs text-gray-600 dark:text-gray-300 ${size === "small" ? "text-s" : "text-md"}`}>{name[0]}</span>
        </div>
    )
}