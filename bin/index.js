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
/**An Enum Representative of our Sorting Algorithms. */
var SortAlgos;
(function (SortAlgos) {
    /**Represents the Insertion Sort Algorithm. */
    SortAlgos[SortAlgos["INSERTION_SORT"] = 0] = "INSERTION_SORT";
    /**Represents the Bubble Sort Algorithm. */
    SortAlgos[SortAlgos["BUBBLE_SORT"] = 1] = "BUBBLE_SORT";
    /**Represents the Cocktail Sort Algorithm. */
    SortAlgos[SortAlgos["COCKTAIL_SORT"] = 2] = "COCKTAIL_SORT";
})(SortAlgos || (SortAlgos = {}));
/**An Enum Representative of our Searching Algorithms. */
var SearchAlgos;
(function (SearchAlgos) {
    /**Represents the Binary Search Algorithm. */
    SearchAlgos[SearchAlgos["BINARY_SEARCH"] = 0] = "BINARY_SEARCH";
    /**Represents the Fibonacci Search Algorithm. */
    SearchAlgos[SearchAlgos["FIBONACCI_SEARCH"] = 1] = "FIBONACCI_SEARCH";
})(SearchAlgos || (SearchAlgos = {}));
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
        });
    });
    //Stop permature form submission.
    document.getElementById("dataSettings").addEventListener("submit", (ev) => {
        ev.preventDefault();
    });
    //Redraw the data when the size has changed.
    document.getElementById("dataSize").addEventListener("change", () => {
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
    document.getElementById("ascndBtn").addEventListener("click", () => {
        updateDataMode(DataMode.ASCENDING);
    });
    document.getElementById("dscndBtn").addEventListener("click", () => {
        updateDataMode(DataMode.DESCENDING);
    });
    document.getElementById("rndmBtn").addEventListener("click", () => {
        updateDataMode(DataMode.RANDOM);
    });
    //Checkbox to force the data set to be the max size always.
    document.getElementById("maxSize").addEventListener("change", () => {
        updateForcedMaxSize(document.getElementById("maxSize").checked);
    });
    //Validation for a number input that stores a search key.
    document.getElementById("searchKey").addEventListener("change", () => {
        validateSearchKey();
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
 * @returns The inner width of the window in pixels, divided by the width of each bar ({@link barWidthPx}) plus 0.3, rounded down.
 */
function getMaxDataSize() {
    return Math.floor(window.innerWidth / (barWidthPx.valueOf() + 0.3));
}
/**
 * Assigns my hovering event handler to the target of a MouseEvent
 * @param e The MouseEvent to to retrieve a target from.
 */
function handleDatemHover(e) {
    var _a;
    if (allowHover) {
        let prevDatem = parseInt((((_a = document.getElementById("hoveredDatem").textContent) === null || _a === void 0 ? void 0 : _a.substring(15)) || "-1"));
        if (prevDatem != -1) {
            Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
                el.style.backgroundColor = "gray";
            });
        }
        ;
        e.target.classList.add("currentlyHoveredDatem");
        e.target.style.backgroundColor = "#00ff00";
        document.getElementById("hoveredDatem").textContent = "Hovered Value: " + e.target.id.replace("displayDatem", "");
    }
}
/** Disables the on hover effexts for datem divs via {@link allowHover}. Removes any active effects. */
function disableHoverMode() {
    allowHover = false;
    Array.from(document.getElementsByClassName("currentlyHoveredDatem")).forEach((el) => {
        el.style.backgroundColor = "gray";
    });
}
/** Function to execute insertion sort. */
function insertionSort() {
    return __awaiter(this, void 0, void 0, function* () {
        disableHoverMode();
        ALGO_RUNNING = true;
        let canvas = Array.from(document.getElementById("dataDisplay").children);
        let localDataSet = Array.from(dataSet);
        for (let index = 0; index < localDataSet.length; index++) {
            let element = localDataSet[index]; //We're trying to find a home for this guy.
            let elHeight = canvas[index].style.height;
            let elId = canvas[index].id;
            let location = index - 1; //We're going to start checking the guy before us.
            while (location >= 0 && localDataSet[location] > element) { //Until we hit the bottom of the list
                canvas[location + 1].style.backgroundColor = "#00ff00";
                canvas[location].style.backgroundColor = "#00ff00";
                localDataSet[location + 1] = localDataSet[location];
                canvas[location + 1].style.height = canvas[location].style.height;
                canvas[location + 1].id = canvas[location].id;
                yield delay(1);
                location--;
            }
            yield delay(1);
            localDataSet[location + 1] = element;
            canvas[location + 1].style.height = elHeight;
            canvas[location + 1].id = elId;
        }
        dataSet = localDataSet;
        currentlySorted = true;
        ALGO_RUNNING = false;
        allowHover = true;
    });
}
/**
 * A function to swap two nodes.
 * Sourced from: br4nnigan on StackOverflow
 * @param n1 The first node involved in swapping.
 * @param n2 The second node involved in swapping.
 */
function swapNodes(n1, n2) {
    var p1 = n1.parentNode;
    var p2 = n2.parentNode;
    var i1 = -1;
    var i2 = -1;
    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1))
        return;
    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }
    if (p1.isEqualNode(p2) && i1 < i2) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}
