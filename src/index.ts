enum AlgoType {
    SORTING_ALGORITHMS,
    SEARCHING_ALGORITHMS
}

let currentAlgos: AlgoType;
let dataSet: Array<Number> = new Array<Number>(0);

window.addEventListener('load', () => {
    (document.getElementById("searchRadio") as HTMLInputElement).checked = false;
    (document.getElementById("sortRadio") as HTMLInputElement).checked = true;
    switchAvailabeAlgos();
    redefineData(0);
    injectScripts();
});

function injectScripts(): void {
    Array.from(document.querySelectorAll("input[name=\"algoType\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            switchAvailabeAlgos();
        });
    });
    (document.getElementById("dataSettings") as HTMLFormElement).addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();
    });
    (document.getElementById("dataSize") as HTMLInputElement).addEventListener("change", () => {
        redefineData((document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
    window.addEventListener("resize", () => {
        redefineData((document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
        drawData();
    });
}

function validateDataSize():boolean {
    return (document.getElementById("dataSize") as HTMLInputElement).valueAsNumber > 0;
}

function redefineData(newSize: number):void {
    dataSet = new Array<Number>(newSize > 0 ? newSize : 0);
}

function switchAvailabeAlgos(): void {
    switch (currentAlgos) {
        case AlgoType.SORTING_ALGORITHMS:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                (el as HTMLInputElement).checked = false;
            });
            Array.from(document.getElementsByClassName("searchingAlgo")).forEach((el) => {
                el.removeAttribute("disabled");
            });
            currentAlgos = AlgoType.SEARCHING_ALGORITHMS;
            break;
        default:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.removeAttribute("disabled");
            });
            Array.from(document.getElementsByClassName("searchingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                (el as HTMLInputElement).checked = false;
            });
            currentAlgos = AlgoType.SORTING_ALGORITHMS;
            break;
    }
}