import { usePath } from "raviger";

export default function AppContainer(props: { children: React.ReactNode }) {
    const { children } = props;
    const path = usePath();

    return <div className={`bg-primary text-primaryFont`}>{children}</div>;
}
