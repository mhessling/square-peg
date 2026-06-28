# Progress

## Where things stand
- Puzzle game where the square moves around a map and solves puzzles by pushing/interacting with other shapes.
- Movement is now top-down/4-directional (`src/player.js`) — gravity and jumping are gone, since this isn't a platformer anymore.
- Map (`src/level.js`) is a bounded room defined as a list of wall rectangles, with one interior wall as a basic obstacle. Player and circles both collide solidly with walls.
- Circles flinch then flee when the square approaches, now fleeing in any direction (not just sideways) and bouncing off walls/each other realistically.
- Square collides solidly with circles (no pass-through) — this is the basis for "pushing" them around in puzzles, though actual pushing (circle gets shoved, not just blocked) isn't implemented yet.

## Next up
- In progress: a "win condition" — a door in the room that lets the player progress to the next room/map. Plan being aligned with the user before implementing.
- Implement actual "pushing": right now the player is blocked by circles but doesn't move them — pushing puzzles need the circle to get shoved when the player walks into it.
- Decide what a "solved" puzzle looks like (e.g. get a circle to a target spot) — needed before maps mean anything as puzzles.
- Define more than one map/level, and a way to switch between them.
- Consider whether "flee" behavior still makes sense for a pushing puzzle, or whether some/all shapes should just sit still until pushed.
