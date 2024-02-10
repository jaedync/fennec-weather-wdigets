/*
Lock screen widget. Shows wind gusts as a progress circle.
This script is meant to be used with Scriptable. You can download Scriptable on the App Store: https://apps.apple.com/us/app/scriptable/id1405459188
Code borrowed in large part from https://github.com/Sillium/telekom-lock-screen-widget <3

To use this widget, you need to create a new Scriptable script on your iOS device and paste the code into the script. 
Then you can add a new Scriptable widget to your lock screen and select this script.

Adapted (sloppily) to connect with LETU Weather API by Jaedyn Chilton

*/


const DEBUG = false;
const log = DEBUG ? console.log.bind(console) : function () { };

// Function to fetch wind speed data
async function fetchWindSpeed() {
  const url = "https://weather.jaedynchilton.com/current";
  const request = new Request(url);
  const response = await request.loadJSON();
  const windSpeed = response.data[0].wind_speed_hi_last_10_min; // Adjust to any other value from the API desired
  return windSpeed;
}

// Initialize the widget
const widget = new ListWidget();

// Get Progress Circle service
let ProgressCircleService = await getService(
    "ProgressCircle",
    "https://gist.githubusercontent.com/Sillium/4210779bc2d759b494fa60ba4f464bd8/raw/9e172bac0513cc3cf0e70f3399e49d10f5d0589c/ProgressCircleService.js",
    DEBUG
);

// Fetch wind speed and calculate progress
const windSpeed = await fetchWindSpeed();
const maxWindSpeed = 10; // Maximum wind speed for the scale
let percent = (windSpeed / maxWindSpeed) * 100;
log("Wind Speed Percent: " + percent);

let progressStack = await ProgressCircleService.drawArc(widget, percent);

// Display the wind speed number in the middle of the progress circle
let windSpeedText = progressStack.addText(`${windSpeed.toFixed(0)}`);
windSpeedText.centerAlignText();
windSpeedText.font = new Font("Verdana", 24);
widget.presentAccessoryCircular(); // Does not present correctly
Script.setWidget(widget);
Script.complete();

// get library from local filestore or download it once
async function getService(name, url, forceDownload) {
    const fm = FileManager.local();
    const scriptDir = module.filename.replace(fm.fileName(module.filename, true), '');
    let serviceDir = fm.joinPath(scriptDir, "lib/service/" + name);

    if (!fm.fileExists(serviceDir)) {
        fm.createDirectory(serviceDir, true);
    }

    let libFile = fm.joinPath(serviceDir, "index.js");
    
    if (fm.fileExists(libFile) && !forceDownload) {
        fm.downloadFileFromiCloud(libFile);
    } else {
        // download once
        let indexjs = await loadText(url);
        fm.write(libFile, indexjs);
    }

    let service = importModule("lib/service/" + name);
    return service;
}

// helper function to download a text file from a given url
async function loadText(textUrl) {
    const req = new Request(textUrl);
    return await req.load();
}// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: exchange-alt;
const DEBUG = false;
const log = DEBUG ? console.log.bind(console) : function () { };

// Function to fetch wind speed data
async function fetchWindSpeed() {
  const url = "https://weather.jaedynchilton.com/current";
  const request = new Request(url);
  const response = await request.loadJSON();
  const windSpeed = response.data[0].wind_speed_hi_last_10_min; // Assuming this represents gusts
  return windSpeed;
}

// Initialize the widget
const widget = new ListWidget();

// Get Progress Circle service
let ProgressCircleService = await getService(
    "ProgressCircle",
    "https://gist.githubusercontent.com/Sillium/4210779bc2d759b494fa60ba4f464bd8/raw/9e172bac0513cc3cf0e70f3399e49d10f5d0589c/ProgressCircleService.js",
    DEBUG
);

// Fetch wind speed and calculate progress
const windSpeed = await fetchWindSpeed();
const maxWindSpeed = 10; // Maximum wind speed for the scale
let percent = (windSpeed / maxWindSpeed) * 100;
log("Wind Speed Percent: " + percent);

let progressStack = await ProgressCircleService.drawArc(widget, percent);

// Display the wind speed number in the middle of the progress circle
let windSpeedText = progressStack.addText(`${windSpeed.toFixed(0)}`);
windSpeedText.centerAlignText();
windSpeedText.font = new Font("Verdana", 24);
widget.presentAccessoryCircular(); // Does not present correctly
Script.setWidget(widget);
Script.complete();

// get library from local filestore or download it once
async function getService(name, url, forceDownload) {
    const fm = FileManager.local();
    const scriptDir = module.filename.replace(fm.fileName(module.filename, true), '');
    let serviceDir = fm.joinPath(scriptDir, "lib/service/" + name);

    if (!fm.fileExists(serviceDir)) {
        fm.createDirectory(serviceDir, true);
    }

    let libFile = fm.joinPath(serviceDir, "index.js");
    
    if (fm.fileExists(libFile) && !forceDownload) {
        fm.downloadFileFromiCloud(libFile);
    } else {
        // download once
        let indexjs = await loadText(url);
        fm.write(libFile, indexjs);
    }

    let service = importModule("lib/service/" + name);
    return service;
}

// helper function to download a text file from a given url
async function loadText(textUrl) {
    const req = new Request(textUrl);
    return await req.load();
}