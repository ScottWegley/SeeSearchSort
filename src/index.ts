enum AlgoSelection {
    SORTING_ALGORITHMS,
    SEARCHING_ALGORITHMS
}

let currentAlgos: AlgoType;

window.addEventListener('load', () => {
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
    }
}