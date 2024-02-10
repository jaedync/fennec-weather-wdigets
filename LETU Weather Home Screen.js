/*

This script creates a widget for the iOS home screen that displays the current weather data from the LETU Weather Station. 
The widget shows the temperature, dew point, average wind speed, and timestamp of the data. 
The data is fetched from the LETU Weather Station API, created by Jaedyn Chilton.

This script is meant to be used with Scriptable. You can download Scriptable on the App Store: https://apps.apple.com/us/app/scriptable/id1405459188

To use this widget, you need to create a new Scriptable script on your iOS device and paste the code into the script. 
Then you can add a new Scriptable widget to your lock screen and select this script.

*/



async function fetchWeatherData() {
    // Define the URL of the API endpoint
    const url = "https://weather.jaedynchilton.com/current";
    
    // Fetch the data from the API
    const request = new Request(url);
    const response = await request.loadJSON();
    
    // Extract the temperature, dew point, average wind speed, and timestamp from the response
    const temperature = response.data[0].temp;
    const dewPoint = response.data[0].dew_point;
    const windSpeedAvgLast10Min = response.data[0].wind_speed_avg_last_10_min;
    const uvIndex = response.data[0].uv_index;
    const ts = response.data[0].ts;    
    const percentHumidity = response.data[0].hum;    
    
    // Return the values
    return { temperature, dewPoint, windSpeedAvgLast10Min, uvIndex, ts, percentHumidity };
  }
  
  // Function to create the widget
  async function createWidget() {
    // Fetch the weather data
    const weatherData = await fetchWeatherData();
    
    // Create a new list widget
    const widget = new ListWidget();
    
    // Set the widget's background gradient to a dark theme
    const startColor = new Color("#2c3e50");
    const endColor = new Color("#34495e");
    const gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0.0, 1.0];
    widget.backgroundGradient = gradient;
    
    // Set the padding for the widget
    widget.setPadding(0, 6, 6, 6);
    
    // Create a vertical stack to hold the temperature and horizontal stack
    const vStack = widget.addStack();
    vStack.layoutVertically();
    vStack.centerAlignContent();
    
    // Add the title to the vertical stack
      const titleText = vStack.addText(" LETU Weather Station");
    titleText.textColor = new Color("#ffffff", 0.7); // White color with 70% opacity    
      titleText.font = Font.boldSystemFont(10); // You can adjust the font size
    
    // Add the temperature to the vertical stack
    const tempText = vStack.addText(`${weatherData.temperature}°F`);
    tempText.textColor = Color.white();
    tempText.font = Font.boldSystemFont(36);  // Increased font size
    
    // Add spacing between temperature and horizontal stack
    vStack.addSpacer(2);  // Adjust the spacing as needed
    
    // Create a horizontal stack for Dew Point and Wind Speed
    const hStack = vStack.addStack();
    hStack.layoutHorizontally();
    hStack.spacing = 10;
    
    // Add the dew point to the horizontal stack
    const labelText = hStack.addText(`Humid:\nDew: \nWind:`);
    labelText.textColor = new Color("#ecf0f1");  // Slightly different color for variation
    labelText.font = Font.systemFont(14);
    
    // Add a vertical divider (using a text element with a vertical line character)
    const divider = hStack.addText("|\n|\n|");
    divider.textColor = new Color("#ecf0f1", 0.5);  // 50% opacity
    divider.font = Font.systemFont(14);
    
    // Add the average wind speed to the horizontal stack
    const valuesText = hStack.addText(`${weatherData.percentHumidity}%\n${weatherData.dewPoint}°F\n${weatherData.windSpeedAvgLast10Min}mi`);
    valuesText.textColor = new Color("#ecf0f1");  // Slightly different color for variation
    valuesText.font = Font.systemFont(14);
    
    // Convert Unix timestamp to DateTime in local timezone
    const localTime = new Date(weatherData.ts * 1000).toLocaleString();
    
    // Add the DateTime to the vertical stack
    vStack.addSpacer(5);  // Adjust the spacing as needed
    const dateTimeText = vStack.addText(`${localTime}`);
    dateTimeText.textColor = Color.gray();
    dateTimeText.font = Font.systemFont(10); // Smaller font size for DateTime
    
    // Return the widget
    return widget;
  }
  
  // Create and display the widget
  const widget = await createWidget();
  if (config.runsInWidget) {
    // Runs inside a widget so add it to the homescreen
    Script.setWidget(widget);
  } else {
    // Runs inside the app, so show a preview
    widget.presentSmall();
  }
  
  Script.complete();