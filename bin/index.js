"use strict";
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
        drawData();
    });
    //Redraw the data when the window horizontal size has changed.
    window.addEventListener("resize", () => {
        if (prevWidth != window.innerWidth) {
            redefineData(forceMaxSize ? getMaxDataSize().valueOf() : document.getElementById("dataSize").valueAsNumber);
            drawData();
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
function updateForcedMaxSize(inState) {
    forceMaxSize = inState;
    if (forceMaxSize) {
        document.getElementById("dataSize").setAttribute("disabled", "true");
        document.getElementById("sizeLbl").setAttribute("disabled", "true");
        redefineData(getMaxDataSize().valueOf());
        drawData();
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
function drawData() {
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
