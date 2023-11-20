import { twMerge } from "tailwind-merge";

export default function Loading(props: { className?: string }) {
    const { className } = props;
    return (
        <div
            className={twMerge(
                `text-center flex items-center justify-center h-full text-2xl`,
                className
            )}
        >
            <i className="far fa-spinner-third animate-spin" />
        </div>
    );
}
