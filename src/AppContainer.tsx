import { usePath } from "raviger";

export default function AppContainer(props: { children: React.ReactNode }) {
    const { children } = props;
    const path = usePath();

    return (
        <div className={`font-manrope bg-primary text-primaryFont`}>
            {children}
        </div>
    );
}
