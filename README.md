# Hexagon-based heightmap generation inspired by "Diamond Square" method

The goal of this project is to generate a heightmap in a hexagon coordinate system using
a similar approach to the Diamond-Square algorthm. 
See https://en.wikipedia.org/wiki/Diamond-square_algorithm

The desired properties of this new algorithm are as follows:
* Unlimited subdivision: Any state should be subdivideable by the algorithm into a new,
more refined state. No size bounds need to be know at the start of the algorithm
* Hexagon coordinates: The output should be a map of height values in a hexagon 
coordinate system. Specifically cube coordinates as defined here: https://www.redblobgames.com/grids/hexagons/#coordinates


The general procedure is as follows:

## Setup
As in diamond-square, set initial values for:
* A maximum height value: _h_max_
* A falloff value: 0 < _f_ < 1


## Step 1

Generate a map of at least 7 hexagons with random height values in the range (0, _h_max_). This is the seed map.

![Step 1](https://raw.githubusercontent.com/generesque/hexmap/main/docs/images/Step1.PNG)

## Step 2
* Update _h_max_ = _h_max_ * _f_

## Step 3

Disperse the map by multiplying the coordinates of each element by 2. This leaves a map
with missing hexagons.

![Step 2](https://raw.githubusercontent.com/generesque/hexmap/main/docs/images/Step2.PNG)

## Step 4

For each hexagon present in the map, fill in all of its neighbours which have 2 adjacent
hexagons from the previous iteration (if not already present). The formula for the height value of this new
hexagon is:
* h_a = height of neighbor A
* h_b = height of neighbor B

`h = ((h_a + h_b) / 2) + (random(0, 1) * h_max) - (h_max / 2)`

That is, the new hexagon's height is the average of its neighbors from the previous
iteration plus a random value between -h_max / 2 and +h_max / 2.

![Step 3](https://raw.githubusercontent.com/generesque/hexmap/main/docs/images/Step3.PNG)

## Step 5
* Repeat from Step 2 until desired resolution is reached