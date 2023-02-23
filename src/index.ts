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

function updateDataMode(inMode:DataMode){
    if(inMode != DataMode.RANDOM && inMode == dataMode){
        return;
    }
    dataMode == inMode;
    drawData();
}
function redefineData(newSize: number): void {
    dataSet = new Array<Number>(newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0);
    (document.getElementById("dataSize") as HTMLInputElement).value = (newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0).toString();
}

function drawData(): void {
    console.log("Lmao drawinnnnnnnng");
    let canvas: HTMLDivElement = document.getElementById("dataDisplay") as HTMLDivElement;
    canvas.innerHTML = "";
    for (let index = 0; index < dataSet.length; index++) {
        dataSet[index] = (dataMode != DataMode.DESCENDING ? index + 1 : dataSet.length - index);
        if (dataMode != DataMode.RANDOM) {
            var toAdd = document.createElement("div");
            toAdd.style.height = (dataSet[index].valueOf() * 3).toString() + "px";
            toAdd.style.width = "9.5px";
            toAdd.style.backgroundColor = "gray";
            toAdd.style.display = "inline-block";
            canvas.appendChild(toAdd);
        }
    }
    if (dataMode == DataMode.RANDOM) {
        let i = dataSet.length;
        while (--i >= 0) {
            let temp = Math.floor(Math.random() * (i + 1));
            [dataSet[temp], dataSet[i]] = [dataSet[i], dataSet[temp]];
        }
        for (let index = 0; index < dataSet.length; index++) {
            var toAdd = document.createElement("div");
            toAdd.style.height = (dataSet[index].valueOf() * 3).toString() + "px";
            toAdd.style.width = barWidthPx.toString() + "px";
            toAdd.style.backgroundColor = "gray";
            toAdd.style.display = "inline-block";
            canvas.appendChild(toAdd);
        }
    }
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