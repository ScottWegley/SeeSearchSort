enum AlgoType {
    SORTING_ALGORITHMS,
    SEARCHING_ALGORITHMS
}

let currentAlgos: AlgoType;

window.addEventListener('load', () => {
    currentAlgos = !(document.getElementById("sortRadio") as HTMLInputElement).checked ? AlgoType.SORTING_ALGORITHMS : AlgoType.SEARCHING_ALGORITHMS;
    switchAvailabeAlgos();
    injectScripts();
})

function injectScripts(): void {
    Array.from(document.querySelectorAll("input[name=\"algoType\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            switchAvailabeAlgos();
        })
    })
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