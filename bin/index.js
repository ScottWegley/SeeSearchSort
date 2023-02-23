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
/**
 * Our "main" function.  Controls the intitial state of the algorithm type radio buttons
 * Force the algorithm radio buttons to update based on the algorithm type. {@link switchAvailabeAlgos()}
 * Wipes the data set by setting the size to 0. {@link redefineData()}
 * Add all event listeners to HTML elements. {@link injectScripts()}
 */
window.addEventListener('load', () => {
    document.getElementById("searchRadio").checked = false;
    document.getElementById("sortRadio").checked = true;
    switchAvailabeAlgos();
    redefineData(0);
    injectScripts();
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
    //Redraw the data when the window size has changed.
    window.addEventListener("resize", () => {
        redefineData(document.getElementById("dataSize").valueAsNumber);
        drawData();
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
    console.log("Lmao drawinnnnnnnng");
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
