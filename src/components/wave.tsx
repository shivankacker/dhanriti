const WaveAnimation = () => {
    return (
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            overflow="auto"
            shapeRendering="auto"
            fill="#ffffff"
        >
            <defs>
                <path
                    id="wavepath"
                    d="M 0 2000 0 500 Q 54.5 446 109 500 t 109 0 109 0 109 0 109 0 109 0 109 0 109 0 109 0 109 0 109 0 109 0  v1000 z"
                />
                <path id="motionpath" d="M -218 0 0 0" />
            </defs>
            <g>
                <use
                    xlinkHref="#wavepath"
                    y="-450"
                    style={{ fill: "var(--kui-accent500)" }}
                >
                    <animateMotion dur="5s" repeatCount="indefinite">
                        <mpath xlinkHref="#motionpath" />
                    </animateMotion>
                </use>
            </g>
        </svg>
    );
};

export default WaveAnimation;
