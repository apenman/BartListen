# BartListen

In Progress...

An exploration into P5.js / Processing and data visualization. Started after a talk by Jonathan Dinu on data sonification at Gray Area.

## Part 1
Part 1 of this project was to use the Bart API with P5.js to visualize when trains leave stations. When a train leaves, a sound is played and an expanding circle is drawn on a random point on the screen with the name of the station displayed in black. The color of the circle maps to the color of the Bart line given by the API. Multiple trains often depart at the same time.

The main sketch file holds the logic of pulling data from the API, setting up data, and handling the main draw loop function. Each bart station is represented as a station object. A station holds data for the next departing train including departure time, line color, direction, and station abbreviation. The circles that mark a train leaving are called blips and handle expanding the radius and fading the color.

![Alt text](/screens/all-depart.png)
All trains departing at app startup.

![Alt text](/screens/single-depart.png)
Lonely Colma station departing on its own.

## Part 2
Part 2 will consist of expanding the project into a more interesting visualization. Currently, trains depart on the minute leaving long gaps where no activity happens on screen (which lead to the addition of the next train countdown being added).

The plan is to map out all the bart lines and scale the map based on the user's screen size. Using the API, the app will track all currently active trains and plot them at their estimated current positions in the bay. Blips will still be drawn when a train is departing a station.

## Limitations
The Bart API only gives the time until departure in minutes which makes accurately tracking where trains are difficult
