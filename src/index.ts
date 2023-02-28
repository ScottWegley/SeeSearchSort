/**An Enum representative of the two different types of algorithms the site currently supports. */
enum AlgoType {
    /**Represents the Sorting Algorithm Selection */
    SORTING_ALGORITHMS,
    /**Represents the Searching Algorithm Selection */
    SEARCHING_ALGORITHMS
}

/**An Enum Representative of our Sorting Algorithms. */
enum SortAlgos {
    /**Represents the Insertion Sort Algorithm. */
    INSERTION_SORT,
    /**Represents the Bubble Sort Algorithm. */
    BUBBLE_SORT,
    /**Represents the Cocktail Sort Algorithm. */
    COCKTAIL_SORT
}

/**An Enum Representative of our Searching Algorithms. */
enum SearchAlgos {
    /**Represents the Binary Search Algorithm. */
    BINARY_SEARCH,
    /**Represents the Fibonacci Search Algorithm. */
    FIBONACCI_SEARCH
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
let dataSet: Array<Number> = new Array<Number>(0);
/** Stores the current order of the data.  Initialized as {@link DataMode.ASCENDING} */
let dataMode: DataMode = DataMode.ASCENDING;
/** Stores the previous width of the window. */
let prevWidth: Number;
/** Store whether or not we are forcing the data set to be of max size. */
let forceMaxSize: Boolean = true;

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
        });
    });
    //Stop permature form submission.
    (document.getElementById("dataSettings") as HTMLFormElement).addEventListener("submit", (ev: SubmitEvent) => {
        ev.preventDefault();
    });
    //Redraw the data when the size has changed.
    (document.getElementById("dataSize") as HTMLInputElement).addEventListener("change", () => {
        redefineData((document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
        drawData();
    });
    //Redraw the data when the window horizontal size has changed.
    window.addEventListener("resize", () => {
        if (prevWidth != window.innerWidth) {
            redefineData(forceMaxSize ? getMaxDataSize().valueOf() : (document.getElementById("dataSize") as HTMLInputElement).valueAsNumber);
            drawData();
            prevWidth = window.innerWidth;
        }
    });
    //Switch the data mode when the data mode buttons are clicked.
    (document.getElementById("ascndBtn") as HTMLButtonElement).addEventListener("click", () => {
        updateDataMode(DataMode.ASCENDING);
    });
    (document.getElementById("dscndBtn") as HTMLButtonElement).addEventListener("click", () => {
        updateDataMode(DataMode.DESCENDING);
    });
    (document.getElementById("rndmBtn") as HTMLButtonElement).addEventListener("click", () => {
        updateDataMode(DataMode.RANDOM);
    });
    //Checkbox to force the data set to be the max size always.
    (document.getElementById("maxSize") as HTMLInputElement).addEventListener("change", () => {
        updateForcedMaxSize((document.getElementById("maxSize") as HTMLInputElement).checked);
    });
    (document.getElementById("searchKey") as HTMLInputElement).addEventListener("change", () => {
        validateSearchKey();
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
    if (inMode != DataMode.RANDOM && inMode == dataMode) {
        return;
    }
    dataMode = inMode;
    drawData();
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
        drawData();
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
function drawData(): void {
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
                let prevDatem: Number = parseInt(((document.getElementById("hoveredDatem") as HTMLLabelElement).textContent?.substring(15) || "-1"));
                if (prevDatem != -1) {
                    Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                        (el as HTMLElement).style.backgroundColor = "gray";
                    });
                };
                (e.target as HTMLElement).classList.add("currentlyHoveredDatem");
                (e.target as HTMLElement).style.backgroundColor = "green";
                (document.getElementById("hoveredDatem") as HTMLLabelElement).textContent = "Hovered Value: " + dataSet[index].valueOf().toString();
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
            toAdd.addEventListener("mouseover", (e) => {
                let prevDatem: Number = parseInt(((document.getElementById("hoveredDatem") as HTMLLabelElement).textContent?.substring(15) || "-1"));
                if (prevDatem != -1) {
                    Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                        (el as HTMLElement).style.backgroundColor = "gray";
                    });
                };
                (e.target as HTMLElement).classList.add("currentlyHoveredDatem");
                (e.target as HTMLElement).style.backgroundColor = "green";
                (document.getElementById("hoveredDatem") as HTMLLabelElement).textContent = "Hovered Value: " + dataSet[index].valueOf().toString();
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
 * @returns The inner width of the window in pixels, divided by the width of each bar ({@link barWidthPx}) plus 0.3, rounded down.
 */
function getMaxDataSize(): Number {
    return Math.floor(window.innerWidth / (barWidthPx.valueOf() + 0.3));
}