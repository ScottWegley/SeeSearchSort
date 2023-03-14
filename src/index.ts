const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**An Enum representative of the two different types of algorithms the site currently supports. */
enum AlgoType {
    /**Represents the Sorting Algorithm Selection */
    SORTING_ALGORITHMS,
    /**Represents the Searching Algorithm Selection */
    SEARCHING_ALGORITHMS
}

/**An Enum Representative of our Searching Algorithms. */
enum Algos {
    /**Represents the Binary Search Algorithm. */
    BINARY_SEARCH,
    /**Represents the Fibonacci Search Algorithm. */
    FIBONACCI_SEARCH,
    /**Represents the Insertion Sort Algorithm. */
    INSERTION_SORT,
    /**Represents the Bubble Sort Algorithm. */
    BUBBLE_SORT,
    /**Represents the Cocktail Sort Algorithm. */
    COCKTAIL_SORT
}

/** An Enum representative of the three different data orders. */
enum DataMode {
    /**Represents the data iterating from one to the size of the data set. */
    ASCENDING,
    /**Represents the data iterating from the size of the data set to one. */
    DESCENDING,
    /**Represents the data in random order, with each value from one to the data set size appearing exactly once. */
    RANDOM
}

/**The width of every bar.*/
let barWidthPx: Number = 9.5;
/** Stores the current type of algorithms available.  Initalized as {@link AlgoType.SORTING_ALGORITHMS}*/
let currentAlgos: AlgoType = AlgoType.SORTING_ALGORITHMS;
/** Represents the current selected algorithm. */
let ACTIVE_ALGORITHM: Algos = Algos.INSERTION_SORT;
/** Internal record of our data values */
let dataSet: Array<Number> = new Array<Number>(0);
/** Stores the current order of the data.  Initialized as {@link DataMode.ASCENDING} */
let dataMode: DataMode = DataMode.ASCENDING;
/** Stores the previous width of the window. */
let prevWidth: Number;
/** Store whether or not we are forcing the data set to be of max size. */
let forceMaxSize: Boolean = true;
/** Store whether or not hover effects are currently allowed. */
let allowHover: Boolean = true;
/** Stores whether or not the {@link dataSet} is currently sorted. */
let currentlySorted: Boolean = false;
/** Stores whether or not an algorithm is current running. */
let ALGO_RUNNING: Boolean = false;

/**
 * Our "main" function.  Controls the intitial state of the algorithm type radio buttons, max size check box, and search key.
 * Force the algorithm radio buttons to update based on the algorithm type. {@link switchAvailabeAlgos()}
 * Wipes the data set by setting the size to 0. {@link redefineData()}
 * Add all event listeners to HTML elements. {@link injectScripts()}
 * Update the state of forcedMaxSize to wipe the data set and change it to the max size. {@link updateForcedMaxSize()}
 */
window.addEventListener('load', () => {
    (document.getElementById("searchRadio") as HTMLInputElement).checked = false;
    (document.getElementById("sortRadio") as HTMLInputElement).checked = true;
    (document.getElementById("maxSize") as HTMLInputElement).checked = true;
    (document.getElementById("searchKey") as HTMLInputElement).valueAsNumber = 1;
    (document.getElementById("insertion") as HTMLInputElement).checked = true;
    prevWidth = window.innerWidth;
    switchAvailabeAlgos();
    injectScripts();
    updateForcedMaxSize(forceMaxSize.valueOf());
});

/**Adds event listeners to the HTML Elements on the page. */
function injectScripts(): void {
    //Switches which radio buttons can be selected when the algorithm category is switched.
    Array.from(document.querySelectorAll("input[name=\"algoType\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            switchAvailabeAlgos();
            updateActiveAlgorithm();
        });
    });
    //Updates which algorithm is selected and enables/disables the run button
    Array.from(document.querySelectorAll("input.searchingAlgo[type=\"radio\"]")).forEach((el) => {
        (el as HTMLInputElement).addEventListener("change", () => {
            updateActiveAlgorithm();
        });
    });
    Array.from(document.querySelectorAll("input.sortingAlgo[type=\"radio\"]")).forEach((el) => {
        (el as HTMLInputElement).addEventListener("change", () => {
            updateActiveAlgorithm();
        });
    });
    //Stop permature form submission.
    (document.getElementById("dataSettings") as HTMLFormElement).addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();
    });
    (document.getElementById("dataDetails") as HTMLFormElement).addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();
    });
    //Redraw the data when the size has changed.
    (document.getElementById("dataSize") as HTMLInputElement).addEventListener("change", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        redefineData((document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
        drawDefaultData();
    });
    //Redraw the data when the window horizontal size has changed.
    window.addEventListener("resize", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        if (prevWidth != window.innerWidth) {
            redefineData(forceMaxSize ? getMaxDataSize().valueOf() : (document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
            drawDefaultData();
            prevWidth = window.innerWidth;
        }
    });
    //Switch the data mode when the data mode buttons are clicked.
    (document.getElementById("ascndBtn") as HTMLButtonElement).addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.ASCENDING);
    });
    (document.getElementById("dscndBtn") as HTMLButtonElement).addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.DESCENDING);
    });
    (document.getElementById("rndmBtn") as HTMLButtonElement).addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.RANDOM);
    });
    //Checkbox to force the data set to be the max size always.
    (document.getElementById("maxSize") as HTMLInputElement).addEventListener("change", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateForcedMaxSize((document.getElementById("maxSize") as HTMLInputElement).checked);
    });
    //Validation for a number input that stores a search key.
    (document.getElementById("searchKey") as HTMLInputElement).addEventListener("change", () => {
        validateSearchKey();
    });
    //Run the active algorithm on the click of the run button.
    (document.getElementById("btnRun") as HTMLButtonElement).addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        runAlgorithm();
    });
}

/**
 * Adds bounds of the search key of 1 (inclusive) and {@link getMaxDataSize()} (inclusive).
 */
function validateSearchKey(): void {
    let value: Number = (document.getElementById("searchKey") as HTMLInputElement).valueAsNumber;
    (document.getElementById("searchKey") as HTMLInputElement).valueAsNumber = (value >= 1 ? (value <= getMaxDataSize() ? value : getMaxDataSize()) : 1).valueOf();
}

/**
 * Handles updating the {@link dataMode} of the site.
 * @param inMode The {@link DataMode} desired.  Always runs if it's equal to {@link DataMode.RANDOM}.
 * Will not run if the desired {@link DataMode} is already active.
 */
function updateDataMode(inMode: DataMode): void {
    if (inMode != DataMode.RANDOM && inMode == dataMode && !currentlySorted) {
        return;
    }
    dataMode = inMode;
    currentlySorted = false;
    drawDefaultData();
}

/**
 * Updates the interally stored active algorithm.
 * Also enables/disables the run button.
 */
function updateActiveAlgorithm(): void {
    let state: boolean = false;
    Array.from(document.querySelectorAll("input.searchingAlgo[type=\"radio\"]")).forEach((el) => {
        if ((el as HTMLInputElement).checked) {
            state = true;
            switch ((el as HTMLElement).id) {
                case "binary":
                    ACTIVE_ALGORITHM = Algos.BINARY_SEARCH;
                    break;
                case "fibonacci":
                    ACTIVE_ALGORITHM = Algos.FIBONACCI_SEARCH;
                    break;
            }
        }
    });
    if (!state) {
        Array.from(document.querySelectorAll("input.sortingAlgo[type=\"radio\"]")).forEach((el) => {
            if ((el as HTMLInputElement).checked) {
                state = true;
                switch ((el as HTMLElement).id) {
                    case "insertion":
                        ACTIVE_ALGORITHM = Algos.INSERTION_SORT;
                        break;
                    case "bubble":
                        ACTIVE_ALGORITHM = Algos.BUBBLE_SORT;
                        break;
                    case "cocktail":
                        ACTIVE_ALGORITHM = Algos.COCKTAIL_SORT;
                        break;
                }
            }
        });
    }
    state ? (document.getElementById("btnRun") as HTMLButtonElement).removeAttribute("disabled") : (document.getElementById("btnRun") as HTMLButtonElement).setAttribute("disabled", "true");
}

/**
 * Update the internal switch for forcing max size.
 * @param inState Desire switch value.
 */
function updateForcedMaxSize(inState: boolean): void {
    forceMaxSize = inState;
    if (forceMaxSize) {
        (document.getElementById("dataSize") as HTMLInputElement).setAttribute("disabled", "true");
        (document.getElementById("sizeLbl") as HTMLLabelElement).setAttribute("disabled", "true");
        redefineData(getMaxDataSize().valueOf());
        drawDefaultData();
    } else {
        (document.getElementById("dataSize") as HTMLInputElement).removeAttribute("disabled");
        (document.getElementById("sizeLbl") as HTMLLabelElement).removeAttribute("disabled");
    }

}

/**
 * Changes the size of the data and clamps it if necessary.  Set the displayed size to the clamped size.
 * @param newSize The desired new size for the data set.  Will be restricted to 0 (inclusize) and 
 * {@link getMaxDataSize()} (exclusive).
 */
function redefineData(newSize: number): void {
    dataSet = new Array<Number>(newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0);
    (document.getElementById("dataSize") as HTMLInputElement).value = (newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0).toString();
}

/**
 * Clears all of the current data bars from the display.  Loop through the array of data and assign values in Ascending or Descending order.
 * If the {@link dataMode} is not {@link DataMode.RANDOM}, draw it.  Else it is randomized via the Fisher-Yates Algorithm and then drawn.
 */
function drawDefaultData(): void {
    (document.getElementById("hoveredDatem") as HTMLLabelElement).textContent = "Hovered Value: ";
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
            toAdd.id = "displayDatem" + dataSet[index];
            toAdd.addEventListener("mouseover", (e) => {
                handleDatemHover(e);
            });
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
            toAdd.id = "displayDatem" + dataSet[index];
            toAdd.addEventListener("mouseover", (e) => {
                handleDatemHover(e);
            });
            canvas.appendChild(toAdd);
        }
    }
}

/**
 * Adds and removed the disabled attribute from the algorithm radio buttons based on the currently selected algorithm type.
 * @see {@link currentAlgos}
 */
function switchAvailabeAlgos(): void {
    currentAlgos = (document.getElementById("sortRadio") as HTMLInputElement).checked ? AlgoType.SORTING_ALGORITHMS : AlgoType.SEARCHING_ALGORITHMS;
    switch (currentAlgos) {
        case AlgoType.SEARCHING_ALGORITHMS:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                (el as HTMLInputElement).checked = false;
            });
            Array.from(document.getElementsByClassName("searchingAlgo")).forEach((el) => {
                el.removeAttribute("disabled");
            });
            break;
        default:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.removeAttribute("disabled");
            });
            Array.from(document.getElementsByClassName("searchingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                (el as HTMLInputElement).checked = false;
            });
            break;
    }
}

/**
 * @returns The inner width of the window in pixels, divided by the width of each bar ({@link barWidthPx}) plus 0.3, rounded down, minus one.
 */
function getMaxDataSize(): Number {
    return Math.floor(window.innerWidth / (barWidthPx.valueOf() + 0.3)) - 1;
}

/**
 * Assigns my hovering event handler to the target of a MouseEvent
 * @param e The MouseEvent to to retrieve a target from.
 */
function handleDatemHover(e: MouseEvent): void {
    if (allowHover) {
        let prevDatem: Number = parseInt(((document.getElementById("hoveredDatem") as HTMLLabelElement).textContent?.substring(15) || "-1"));
        if (prevDatem != -1) {
            Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                (el as HTMLElement).style.backgroundColor = "gray";
            });
        };
        (e.target as HTMLElement).classList.add("currentlyHoveredDatem");
        (e.target as HTMLElement).style.backgroundColor = "#00ff00";
        (document.getElementById("hoveredDatem") as HTMLLabelElement).textContent = "Hovered Value: " + (e.target as HTMLElement).id.replace("displayDatem", "");
    }
}

/** Disables the on hover effexts for datem divs via {@link allowHover}. Removes any active effects. */
function disableHoverMode(): void {
    allowHover = false;
    Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
        (el as HTMLElement).style.backgroundColor = "gray";
    });
}

/**
 * Function to set the entire display to a color in RGB format (clamped to 0-255, inclusive, for all values).
 * @param r The r value of the color.
 * @param g The g value of the color.
 * @param b The b value of the color.
 */
function setDatemRGB(r: Number, g: Number, b: Number) {
    r = r >= 0 ? (r <= 255 ? r : 255) : 0;
    g = g >= 0 ? (g <= 255 ? g : 255) : 0;
    b = b >= 0 ? (b <= 255 ? b : 255) : 0;
    let RGBString: Array<String> = new Array<String>(3);
    RGBString[0] = r.toString(16);
    RGBString[0] = RGBString[0].length == 1 ? "0" + RGBString[0] : RGBString[0];
    RGBString[1] = g.toString(16);
    RGBString[1] = RGBString[1].length == 1 ? "0" + RGBString[1] : RGBString[1];
    RGBString[2] = b.toString(16);
    RGBString[2] = RGBString[2].length == 1 ? "0" + RGBString[2] : RGBString[2];
    let color = "#" + RGBString[0] + RGBString[1] + RGBString[2];
    setDatemColor(color);
}

/**
 * Function to set the entire display to a color useing a string Color.
 * @param color A color formatted as #XX00XX or a named color.
 */
function setDatemColor(color: string) {
    setDatemRangeColor(color);
}

/**
 * Function to set all datem in a range to a string Color.
 * @param color A color formatted as #XX00XX or a named color.
 * @param start Inclusive lower bound of the range, 0 by default.
 * @param end Inclusive upper bound of the range, the size of the data - 1 by default.
 */
function setDatemRangeColor(color:string, start:number = 0, end:number = dataSet.length - 1){
    let canvas = (document.getElementById("dataDisplay") as HTMLDivElement).children;
    for (let i = start; i <= end; i++) {
        (canvas[i] as HTMLElement).style.backgroundColor = color;        
    }
}

async function runAlgorithm(): Promise<void> {
    disableHoverMode();
    ALGO_RUNNING = true;
    switch (ACTIVE_ALGORITHM) {
        case Algos.BINARY_SEARCH:

            break;
        case Algos.FIBONACCI_SEARCH:
            break;
        case Algos.INSERTION_SORT:
            await insertionSort();
            break;
        case Algos.BUBBLE_SORT:
            await bubbleSort();
            break;
        case Algos.COCKTAIL_SORT:
            await cocktailSort();
            break;

    }
    setDatemColor("gray");
    currentlySorted = true;
    ALGO_RUNNING = false;
    allowHover = true;
}

/** Function to execute insertion sort. */
async function insertionSort(): Promise<void> {
    let canvas = Array.from((document.getElementById("dataDisplay") as HTMLDivElement).children);
    let localDataSet: Array<Number> = Array.from(dataSet);
    for (let i = 0; i < localDataSet.length; i++) {
        let element = localDataSet[i]; //We're trying to find a home for this guy.
        let elHeight = (canvas[i] as HTMLElement).style.height;
        let elId = (canvas[i] as HTMLElement).id;
        let preI = i - 1; //We're going to start checking the guy before us.
        while (preI >= 0 && localDataSet[preI] > element) { //Until we hit the bottom of the list
            // (canvas[location + 1] as HTMLElement).style.backgroundColor = "#00ff00";
            // (canvas[location] as HTMLElement).style.backgroundColor = "#00ff00";
            localDataSet[preI + 1] = localDataSet[preI];
            (canvas[preI + 1] as HTMLElement).style.height = (canvas[preI] as HTMLElement).style.height;
            (canvas[preI + 1] as HTMLElement).id = (canvas[preI] as HTMLElement).id;
            preI--;
            // await delay(1); //Remove this delay for excessively fast sort.
        }
        await delay(1);
        localDataSet[preI + 1] = element;
        (canvas[preI + 1] as HTMLElement).style.height = elHeight;
        (canvas[preI + 1] as HTMLElement).id = elId;
    }
    dataSet = localDataSet;
}

/** Function to execute bubble sort. */
async function bubbleSort(): Promise<void> {
    let canvas = Array.from((document.getElementById("dataDisplay") as HTMLDivElement).children);
    let localDataSet: Array<Number> = Array.from(dataSet);
    let numOfPairs: number = localDataSet.length;
    let swapped: boolean = true;
    while (swapped) {
        numOfPairs--;
        let lastLocation: number = -1;
        swapped = false;
        for (let i = 0; i < numOfPairs; i++) {
            if (localDataSet[i] > localDataSet[i + 1]) {
                [localDataSet[i], localDataSet[i + 1]] = [localDataSet[i + 1], localDataSet[i]];
                swapped = true;
                let plusOneHeight = (canvas[i + 1] as HTMLElement).style.height;
                let plusOneId = (canvas[i + 1] as HTMLElement).id;
                (canvas[i + 1] as HTMLElement).style.height = (canvas[i] as HTMLElement).style.height;
                (canvas[i + 1] as HTMLElement).id = (canvas[i] as HTMLElement).id;
                (canvas[i] as HTMLElement).id = plusOneId;
                (canvas[i] as HTMLElement).style.height = plusOneHeight;
                lastLocation = i + 1;
            } else {
                lastLocation = i;
            }
        }
        await delay(1);
    }
    dataSet = localDataSet;
}

/** Function to execute cocktail sort. */
async function cocktailSort(): Promise<void> {
    let canvas = Array.from((document.getElementById("dataDisplay") as HTMLDivElement).children);
    let localDataSet: Array<Number> = Array.from(dataSet);
    let lower = 0;
    let upper = localDataSet.length - 1;

    while (true) {
        let lastSwap = upper;
        for (let i = upper; i > lower; i--) {
            if (localDataSet[i] < localDataSet[i - 1]) {
                [localDataSet[i - 1], localDataSet[i]] = [localDataSet[i], localDataSet[i - 1]];
                lastSwap = i;
                let preIHeight = (canvas[i - 1] as HTMLElement).style.height;
                let preIiD = (canvas[i - 1] as HTMLElement).id;
                (canvas[i - 1] as HTMLElement).id = (canvas[i] as HTMLElement).id;
                (canvas[i - 1] as HTMLElement).style.height = (canvas[i] as HTMLElement).style.height;
                (canvas[i] as HTMLElement).style.height = preIHeight;
                (canvas[i] as HTMLElement).id = preIiD;
            }
        }
        await delay(1);
        lower = lastSwap;
        if (lower == upper) break;
        for (let i = lower; i < upper; i++) {
            if (localDataSet[i] > localDataSet[i + 1]) {
                [localDataSet[i + 1], localDataSet[i]] = [localDataSet[i], localDataSet[i + 1]];
                lastSwap = i;
                let postIHeight = (canvas[i + 1] as HTMLElement).style.height;
                let postIiD = (canvas[i + 1] as HTMLElement).id;
                (canvas[i + 1] as HTMLElement).style.height = (canvas[i] as HTMLElement).style.height;
                (canvas[i + 1] as HTMLElement).id = (canvas[i] as HTMLElement).id;
                (canvas[i] as HTMLElement).style.height = postIHeight;
                (canvas[i] as HTMLElement).id = postIiD;
            }
        }
        await delay(1);
        upper = lastSwap;
        if (lower == upper) break;
    }
    dataSet = localDataSet;
}

async function binarySearch(): Promise<void> {
    let canvas = Array.from((document.getElementById("dataDisplay") as HTMLDivElement).children);
    let localDataSet: Array<Number> = Array.from(dataSet);
}