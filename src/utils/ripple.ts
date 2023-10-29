const getParentElementWithClass = (element: HTMLElement, className: string) => {
    if (element.classList && element.classList.contains(className)) {
        return element;
    }

    while (element.parentNode) {
        element = element.parentNode as HTMLElement;
        if (element.classList && element.classList.contains(className)) {
            return element;
        }
    }
    return null;
};

export const Ripple = (e: any) => {
    //let target = e.currentTarget as HTMLElement;
    const target = getParentElementWithClass(e.target, "ripple") as HTMLElement;
    if (!target) return;

    let revertRelative: string | null = null;
    let revertOverflow: string | null = null;

    if (target.style.position !== "relative") {
        revertRelative = target.style.position;
        target.style.position = "relative";
    }

    if (target.style.overflow !== "hidden") {
        revertOverflow = target.style.overflow;
        target.style.overflow = "hidden";
    }

    const xPos = e.pageX;
    const yPos = e.pageY;

    let aW = target.clientWidth * 4;
    const aH = target.clientHeight * 4;

    if (aW < aH) {
        aW = aH;
    }

    const scrollParent =
        getParentElementWithClass(target, "overflow-auto") || document.body;

    const scrollX = scrollParent.scrollLeft || 0;
    const scrollY = scrollParent.scrollTop || 0;

    const x = xPos - target.offsetLeft - aW / 2 + scrollX;
    const y = yPos - target.offsetTop - aW / 2 + scrollY;

    const rippleID = "ripple_" + Math.random().toString(16).slice(2);

    const rippleDiv = document.createElement("div");
    rippleDiv.setAttribute("id", rippleID);
    rippleDiv.setAttribute("class", "ripple-circle");
    rippleDiv.setAttribute("style", `left:${x}px;top:${y}px;--aW:${aW}px;`);

    target.appendChild(rippleDiv);

    setTimeout(() => {
        rippleDiv.remove();
        if (revertRelative) target.style.position = revertRelative;
        if (revertOverflow) target.style.overflow = revertOverflow;
    }, 1000);
};
