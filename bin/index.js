"use strict";
var AlgoType;
(function (AlgoType) {
    AlgoType[AlgoType["SORTING_ALGORITHMS"] = 0] = "SORTING_ALGORITHMS";
    AlgoType[AlgoType["SEARCHING_ALGORITHMS"] = 1] = "SEARCHING_ALGORITHMS";
})(AlgoType || (AlgoType = {}));
let currentAlgos;
window.addEventListener('load', () => {
    currentAlgos = !document.getElementById("sortRadio").checked ? AlgoType.SORTING_ALGORITHMS : AlgoType.SEARCHING_ALGORITHMS;
    switchAvailabeAlgos();
    injectScripts();
});
function injectScripts() {
    Array.from(document.querySelectorAll("input[name=\"algoType\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            switchAvailabeAlgos();
        });
    });
}
function switchAvailabeAlgos() {
    switch (currentAlgos) {
        case AlgoType.SORTING_ALGORITHMS:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                el.checked = false;
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
                el.checked = false;
            });
            currentAlgos = AlgoType.SORTING_ALGORITHMS;
            break;
    }
}
