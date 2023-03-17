"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const delay = (ms) => new Promise(res => setTimeout(res, ms));
/**An Enum representative of the two different types of algorithms the site currently supports. */
var AlgoType;
(function (AlgoType) {
    /**Represents the Sorting Algorithm Selection */
    AlgoType[AlgoType["SORTING_ALGORITHMS"] = 0] = "SORTING_ALGORITHMS";
    /**Represents the Searching Algorithm Selection */
    AlgoType[AlgoType["SEARCHING_ALGORITHMS"] = 1] = "SEARCHING_ALGORITHMS";
})(AlgoType || (AlgoType = {}));
/**An Enum Representative of our Searching Algorithms. */
var Algos;
(function (Algos) {
    /**Represents the Linear Search Algorithm. */
    Algos[Algos["LINEAR_SEARCH"] = 0] = "LINEAR_SEARCH";
    /**Represents the Binary Search Algorithm. */
    Algos[Algos["BINARY_SEARCH"] = 1] = "BINARY_SEARCH";
    /**Represents the Fibonacci Search Algorithm. */
    Algos[Algos["FIBONACCI_SEARCH"] = 2] = "FIBONACCI_SEARCH";
    /**Represents the Insertion Sort Algorithm. */
    Algos[Algos["INSERTION_SORT"] = 3] = "INSERTION_SORT";
    /**Represents the Bubble Sort Algorithm. */
    Algos[Algos["BUBBLE_SORT"] = 4] = "BUBBLE_SORT";
    /**Represents the Cocktail Sort Algorithm. */
    Algos[Algos["COCKTAIL_SORT"] = 5] = "COCKTAIL_SORT";
})(Algos || (Algos = {}));
/** An Enum representative of the three different data orders. */
var DataMode;
(function (DataMode) {
    /**Represents the data iterating from one to the size of the data set. */
    DataMode[DataMode["ASCENDING"] = 0] = "ASCENDING";
    /**Represents the data iterating from the size of the data set to one. */
    DataMode[DataMode["DESCENDING"] = 1] = "DESCENDING";
    /**Represents the data in random order, with each value from one to the data set size appearing exactly once. */
    DataMode[DataMode["RANDOM"] = 2] = "RANDOM";
})(DataMode || (DataMode = {}));
/**The width of every bar.*/
let barWidthPx = 9.5;
/** Stores the current type of algorithms available.  Initalized as {@link AlgoType.SORTING_ALGORITHMS}*/
let currentAlgos = AlgoType.SORTING_ALGORITHMS;
/** Represents the current selected algorithm. */
let ACTIVE_ALGORITHM = Algos.INSERTION_SORT;
/** Internal record of our data values */
let dataSet = new Array(0);
/** Stores the current order of the data.  Initialized as {@link DataMode.ASCENDING} */
let dataMode = DataMode.ASCENDING;
/** Stores the previous width of the window. */
let prevWidth;
/** Store whether or not we are forcing the data set to be of max size. */
let forceMaxSize = true;
/** Store whether or not hover effects are currently allowed. */
let allowHover = true;
/** Stores whether or not the {@link dataSet} is currently sorted. */
let currentlySorted = false;
/** Stores whether or not an algorithm is current running. */
let ALGO_RUNNING = false;
/** Stores whether or not the data set current has search coloring. */
let COLORED = false;
/**
 * Our "main" function.  Controls the intitial state of the algorithm type radio buttons, max size check box, and search key.
 * Force the algorithm radio buttons to update based on the algorithm type. {@link switchAvailabeAlgos()}
 * Wipes the data set by setting the size to 0. {@link redefineData()}
 * Add all event listeners to HTML elements. {@link injectScripts()}
 * Update the state of forcedMaxSize to wipe the data set and change it to the max size. {@link updateForcedMaxSize()}
 */
window.addEventListener('load', () => {
    document.getElementById("searchRadio").checked = false;
    document.getElementById("sortRadio").checked = true;
    document.getElementById("maxSize").checked = true;
    document.getElementById("searchKey").valueAsNumber = 1;
    document.getElementById("insertion").checked = true;
    prevWidth = window.innerWidth;
    switchAvailabeAlgos();
    injectScripts();
    updateForcedMaxSize(forceMaxSize.valueOf());
});
/**Adds event listeners to the HTML Elements on the page. */
function injectScripts() {
    //Switches which radio buttons can be selected when the algorithm category is switched.
    Array.from(document.querySelectorAll("input[name=\"algoType\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            switchAvailabeAlgos();
            updateActiveAlgorithm();
        });
    });
    //Updates which algorithm is selected and enables/disables the run button
    Array.from(document.querySelectorAll("input.searchingAlgo[type=\"radio\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            updateActiveAlgorithm();
        });
    });
    Array.from(document.querySelectorAll("input.sortingAlgo[type=\"radio\"]")).forEach((el) => {
        el.addEventListener("change", () => {
            updateActiveAlgorithm();
        });
    });
    //Stop permature form submission.
    document.getElementById("dataSettings").addEventListener("submit", (ev) => {
        ev.preventDefault();
    });
    document.getElementById("dataDetails").addEventListener("submit", (ev) => {
        ev.preventDefault();
    });
    //Redraw the data when the size has changed.
    document.getElementById("dataSize").addEventListener("change", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        redefineData(document.getElementById("dataSize").valueAsNumber);
        drawDefaultData();
    });
    //Redraw the data when the window horizontal size has changed.
    window.addEventListener("resize", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        if (prevWidth != window.innerWidth) {
            redefineData(forceMaxSize ? getMaxDataSize().valueOf() : document.getElementById("dataSize").valueAsNumber);
            drawDefaultData();
            prevWidth = window.innerWidth;
        }
    });
    //Switch the data mode when the data mode buttons are clicked.
    document.getElementById("ascndBtn").addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.ASCENDING);
    });
    document.getElementById("dscndBtn").addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.DESCENDING);
    });
    document.getElementById("rndmBtn").addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateDataMode(DataMode.RANDOM);
    });
    //Checkbox to force the data set to be the max size always.
    document.getElementById("maxSize").addEventListener("change", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        updateForcedMaxSize(document.getElementById("maxSize").checked);
    });
    //Validation for a number input that stores a search key.
    document.getElementById("searchKey").addEventListener("change", () => {
        validateSearchKey();
    });
    //Run the active algorithm on the click of the run button.
    document.getElementById("btnRun").addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        runAlgorithm();
    });
    //Reset the color of the data on button press.
    document.getElementById("btnClr").addEventListener("click", (ev) => {
        if (ALGO_RUNNING) {
            ev.preventDefault();
            return;
        }
        setDatemColor("gray");
    });
}
/**
 * Adds bounds of the search key of 1 (inclusive) and {@link getMaxDataSize()} (inclusive).
 */
function validateSearchKey() {
    let value = document.getElementById("searchKey").valueAsNumber;
    document.getElementById("searchKey").valueAsNumber = (value >= 1 ? (value <= getMaxDataSize() ? value : getMaxDataSize()) : 1).valueOf();
}
/**
 * Handles updating the {@link dataMode} of the site.
 * @param inMode The {@link DataMode} desired.  Always runs if it's equal to {@link DataMode.RANDOM}.
 * Will not run if the desired {@link DataMode} is already active.
 */
function updateDataMode(inMode) {
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
function updateActiveAlgorithm() {
    let state = false;
    Array.from(document.querySelectorAll("input.searchingAlgo[type=\"radio\"]")).forEach((el) => {
        if (el.checked) {
            state = true;
            switch (el.id) {
                case "binary":
                    ACTIVE_ALGORITHM = Algos.BINARY_SEARCH;
                    break;
                case "fibonacci":
                    ACTIVE_ALGORITHM = Algos.FIBONACCI_SEARCH;
                    break;
                case "linear":
                    ACTIVE_ALGORITHM = Algos.LINEAR_SEARCH;
                    break;
            }
        }
    });
    if (!state) {
        Array.from(document.querySelectorAll("input.sortingAlgo[type=\"radio\"]")).forEach((el) => {
            if (el.checked) {
                state = true;
                switch (el.id) {
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
    state ? document.getElementById("btnRun").removeAttribute("disabled") : document.getElementById("btnRun").setAttribute("disabled", "true");
}
/**
 * Update the internal switch for forcing max size.
 * @param inState Desire switch value.
 */
function updateForcedMaxSize(inState) {
    forceMaxSize = inState;
    if (forceMaxSize) {
        document.getElementById("dataSize").setAttribute("disabled", "true");
        document.getElementById("sizeLbl").setAttribute("disabled", "true");
        redefineData(getMaxDataSize().valueOf());
        drawDefaultData();
    }
    else {
        document.getElementById("dataSize").removeAttribute("disabled");
        document.getElementById("sizeLbl").removeAttribute("disabled");
    }
}
/**
 * Changes the size of the data and clamps it if necessary.  Set the displayed size to the clamped size.
 * @param newSize The desired new size for the data set.  Will be restricted to 0 (inclusize) and
 * {@link getMaxDataSize()} (exclusive).
 */
function redefineData(newSize) {
    dataSet = new Array(newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0);
    document.getElementById("dataSize").value = (newSize > 0 ? (newSize < getMaxDataSize() ? newSize : getMaxDataSize()) : 0).toString();
}
/**
 * Clears all of the current data bars from the display.  Loop through the array of data and assign values in Ascending or Descending order.
 * If the {@link dataMode} is not {@link DataMode.RANDOM}, draw it.  Else it is randomized via the Fisher-Yates Algorithm and then drawn.
 */
function drawDefaultData() {
    document.getElementById("hoveredDatem").textContent = "Hovered Value: ";
    let canvas = document.getElementById("dataDisplay");
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
            toAdd.classList.add("datemDiv");
            toAdd.addEventListener("mouseover", (e) => {
                handleDatemHover(e);
            });
            toAdd.addEventListener("mouseleave", (e) => {
                handleHoverLeave(e);
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
            toAdd.classList.add("datemDiv");
            toAdd.addEventListener("mouseover", (e) => {
                handleDatemHover(e);
            });
            toAdd.addEventListener("mouseleave", (e) => {
                handleHoverLeave(e);
            });
            canvas.appendChild(toAdd);
        }
    }
}
/**
 * Adds and removed the disabled attribute from the algorithm radio buttons based on the currently selected algorithm type.
 * @see {@link currentAlgos}
 */
function switchAvailabeAlgos() {
    currentAlgos = document.getElementById("sortRadio").checked ? AlgoType.SORTING_ALGORITHMS : AlgoType.SEARCHING_ALGORITHMS;
    switch (currentAlgos) {
        case AlgoType.SEARCHING_ALGORITHMS:
            Array.from(document.getElementsByClassName("sortingAlgo")).forEach((el) => {
                el.setAttribute("disabled", "true");
                el.checked = false;
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
                el.checked = false;
            });
            break;
    }
}
/**
 * @returns The inner width of the window in pixels, divided by the width of each bar ({@link barWidthPx}) plus 0.3, rounded down, minus one.
 */
function getMaxDataSize() {
    return Math.floor(window.innerWidth / (barWidthPx.valueOf() + 0.3)) - 1;
}
/**
 * Assigns my hovering event handler to the target of a MouseEvent
 * @param e The MouseEvent to to retrieve a target from.
 */
function handleDatemHover(e) {
    var _a;
    if (allowHover) {
        if (COLORED) {
            COLORED = false;
            setDatemColor("gray");
        }
        let prevDatem = parseInt((((_a = document.getElementById("hoveredDatem").textContent) === null || _a === void 0 ? void 0 : _a.substring(15)) || "-1"));
        if (prevDatem != -1) {
            Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                el.style.backgroundColor = "gray";
                el.classList.remove("currentlyHoveredDatem");
            });
        }
        ;
        e.target.classList.add("currentlyHoveredDatem");
        e.target.style.backgroundColor = "#00ff00";
        document.getElementById("hoveredDatem").textContent = "Hovered Value: " + e.target.id.replace("displayDatem", "");
    }
}
/**
 * Removes any highlights from data if none is hovered.
 * @param e
 */
function handleHoverLeave(e) {
    if (allowHover) {
        if (document.querySelectorAll("div.datemDiv:hover").length == 0) {
            Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                el.style.backgroundColor = "gray";
                el.classList.remove("currentlyHoveredDatem");
            });
            document.getElementById("hoveredDatem").textContent = "Hovered Value: ";
        }
    }
}
/** Disables the on hover effexts for datem divs via {@link allowHover}. Removes any active effects. */
function disableHoverMode() {
    allowHover = false;
    Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
        el.style.backgroundColor = "gray";
    });
}
/**
 * Function to get a string color from an RGB format (clamped
 * to 0-255, inclusive, for all values).
 * @param r The r value of the color.
 * @param g The g value of the color.
 * @param b The b value of the color.
 */
function colorFromRGB(r, g, b) {
    r = r >= 0 ? (r <= 255 ? r : 255) : 0;
    g = g >= 0 ? (g <= 255 ? g : 255) : 0;
    b = b >= 0 ? (b <= 255 ? b : 255) : 0;
    let RGBString = new Array(3);
    RGBString[0] = r.toString(16);
    RGBString[0] = RGBString[0].length == 1 ? "0" + RGBString[0] : RGBString[0];
    RGBString[1] = g.toString(16);
    RGBString[1] = RGBString[1].length == 1 ? "0" + RGBString[1] : RGBString[1];
    RGBString[2] = b.toString(16);
    RGBString[2] = RGBString[2].length == 1 ? "0" + RGBString[2] : RGBString[2];
    return "#" + RGBString[0] + RGBString[1] + RGBString[2];
}
/**
 * Function to set the entire display to a color useing a string Color.
 * @param color A color formatted as #XX00XX or a named color.
 */
function setDatemColor(color) {
    setDatemRangeColor(color);
}
/**
 * Function to set all datem in a range to a string Color.
 * @param color A color formatted as #XX00XX or a named color.
 * @param start Inclusive lower bound of the range, 0 by default.
 * @param end Inclusive upper bound of the range, the size of the data - 1 by default.
 */
function setDatemRangeColor(color, start = 0, end = dataSet.length - 1) {
    let canvas = document.getElementById("dataDisplay").children;
    for (let i = start; i <= end; i++) {
        canvas[i].style.backgroundColor = color;
    }
}
function runAlgorithm() {
    return __awaiter(this, void 0, void 0, function* () {
        disableHoverMode();
        ALGO_RUNNING = true;
        switch (ACTIVE_ALGORITHM) {
            case Algos.LINEAR_SEARCH:
                yield linearSearch();
                COLORED = true;
                break;
            case Algos.BINARY_SEARCH:
                if (!(dataMode == DataMode.ASCENDING)) {
                    alert("You cannot run this algorithm on unsorted data.");
                }
                else {
                    yield binarySearch();
                    COLORED = true;
                }
                break;
            case Algos.FIBONACCI_SEARCH:
                break;
            case Algos.INSERTION_SORT:
                if (dataMode == DataMode.ASCENDING) {
                    alert("This data is already sorted.");
                }
                else {
                    yield insertionSort();
                }
                break;
            case Algos.BUBBLE_SORT:
                if (dataMode == DataMode.ASCENDING) {
                    alert("This data is already sorted.");
                }
                else {
                    yield bubbleSort();
                }
                break;
            case Algos.COCKTAIL_SORT:
                if (dataMode == DataMode.ASCENDING) {
                    alert("This data is already sorted.");
                }
                else {
                    yield cocktailSort();
                }
                break;
        }
        currentlySorted = true;
        ALGO_RUNNING = false;
        allowHover = true;
    });
}
/** Function to execute insertion sort. */
function insertionSort() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        for (let i = 0; i < localDataSet.length; i++) {
            let element = localDataSet[i]; //We're trying to find a home for this guy.
            let elHeight = canvas[i].style.height;
            let elId = canvas[i].id;
            let preI = i - 1; //We're going to start checking the guy before us.
            while (preI >= 0 && localDataSet[preI] > element) { //Until we hit the bottom of the list
                localDataSet[preI + 1] = localDataSet[preI];
                canvas[preI + 1].style.height = canvas[preI].style.height;
                canvas[preI + 1].id = canvas[preI].id;
                preI--;
                // await delay(1); //Remove this delay for excessively fast sort.
            }
            yield delay(1);
            localDataSet[preI + 1] = element;
            canvas[preI + 1].style.height = elHeight;
            canvas[preI + 1].id = elId;
        }
        dataSet = localDataSet;
    });
}
/** Function to execute bubble sort. */
function bubbleSort() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        let numOfPairs = localDataSet.length;
        let swapped = true;
        while (swapped) {
            numOfPairs--;
            let lastLocation = -1;
            swapped = false;
            for (let i = 0; i < numOfPairs; i++) {
                if (localDataSet[i] > localDataSet[i + 1]) {
                    [localDataSet[i], localDataSet[i + 1]] = [localDataSet[i + 1], localDataSet[i]];
                    swapped = true;
                    let plusOneHeight = canvas[i + 1].style.height;
                    let plusOneId = canvas[i + 1].id;
                    canvas[i + 1].style.height = canvas[i].style.height;
                    canvas[i + 1].id = canvas[i].id;
                    canvas[i].id = plusOneId;
                    canvas[i].style.height = plusOneHeight;
                    lastLocation = i + 1;
                }
                else {
                    lastLocation = i;
                }
            }
            yield delay(1);
        }
        dataSet = localDataSet;
    });
}
/** Function to execute cocktail sort. */
function cocktailSort() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        let lower = 0;
        let upper = localDataSet.length - 1;
        while (true) {
            let lastSwap = upper;
            for (let i = upper; i > lower; i--) {
                if (localDataSet[i] < localDataSet[i - 1]) {
                    [localDataSet[i - 1], localDataSet[i]] = [localDataSet[i], localDataSet[i - 1]];
                    lastSwap = i;
                    let preIHeight = canvas[i - 1].style.height;
                    let preIiD = canvas[i - 1].id;
                    canvas[i - 1].id = canvas[i].id;
                    canvas[i - 1].style.height = canvas[i].style.height;
                    canvas[i].style.height = preIHeight;
                    canvas[i].id = preIiD;
                }
            }
            yield delay(1);
            lower = lastSwap;
            if (lower == upper)
                break;
            for (let i = lower; i < upper; i++) {
                if (localDataSet[i] > localDataSet[i + 1]) {
                    [localDataSet[i + 1], localDataSet[i]] = [localDataSet[i], localDataSet[i + 1]];
                    lastSwap = i;
                    let postIHeight = canvas[i + 1].style.height;
                    let postIiD = canvas[i + 1].id;
                    canvas[i + 1].style.height = canvas[i].style.height;
                    canvas[i + 1].id = canvas[i].id;
                    canvas[i].style.height = postIHeight;
                    canvas[i].id = postIiD;
                }
            }
            yield delay(1);
            upper = lastSwap;
            if (lower == upper)
                break;
        }
        dataSet = localDataSet;
    });
}
/** Function to execute linear search. */
function linearSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        let searchKey = document.getElementById("searchKey").valueAsNumber;
        for (let i = 0; i < localDataSet.length; i++) {
            if (localDataSet[i] == searchKey) {
                canvas[i].style.backgroundColor = "#00ff00";
                return;
            }
            else {
                canvas[i].style.backgroundColor = "red";
            }
            yield delay(1);
        }
        return;
    });
}
/** Function to execute binary search. */
function binarySearch() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        let searchKey = document.getElementById("searchKey").valueAsNumber;
        let start = 0;
        let end = localDataSet.length;
        let middle;
        let prevStart = 0;
        let prevEnd = localDataSet.length;
        while (start <= end) {
            middle = Math.floor((start + end) / 2);
            if (searchKey > localDataSet[middle]) {
                prevStart = start;
                start = middle + 1;
                for (let i = prevStart; i <= start; i++) {
                    setDatemRangeColor("red", i, i);
                    yield delay(1);
                }
            }
            else if (localDataSet[middle] > searchKey) {
                prevEnd = end;
                end = middle - 1;
                for (let i = end; i < prevEnd; i++) {
                    setDatemRangeColor("red", i, i);
                    yield delay(1);
                }
            }
            else {
                canvas[middle].style.backgroundColor = "#00ff00";
                return;
            }
        }
    });
}
