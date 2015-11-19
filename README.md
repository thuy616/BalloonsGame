# balloons Shooting Game
The game has 3 levels. The player needs to hit 5 green balloons to advance to the next level. If she misses a green balloon, she will lose 1 life.
The difficulty level increases linearly as the number of options (balloons) increase according to Hick-Hyman's law. 

#Predicted Throughput vs Actual Throughput
The actual throughput by the player is calculated and displayed at the end of the level when she lost or won the game. The average movement time is calculated as the sum of time between each correct hits, divided by 5 (the required green hits to pass). 
If the actual throughput is greater than the predicted throughput, the player should pass the level.
Otherwise, she loses the game.