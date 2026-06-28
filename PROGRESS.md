# Progress

## Where things stand
- Puzzle game where the square moves around a map and solves puzzles by pushing/interacting with other shapes.
- Movement is now top-down/4-directional (`src/player.js`) — gravity and jumping are gone, since this isn't a platformer anymore.
- Map (`src/level.js`) is a bounded room defined as a list of wall rectangles, with one interior wall as a basic obstacle. Player and circles both collide solidly with walls.
- Circles flinch then flee when the square approaches, now fleeing in any direction (not just sideways) and bouncing off walls/each other realistically.
- Square collides solidly with circles (no pass-through) — this is the basis for "pushing" them around in puzzles, though actual pushing (circle gets shoved, not just blocked) isn't implemented yet.
- The map is now a sequence of rooms (`level.rooms` in `src/level.js`), each with its own walls, door, circle starting positions, and player start point. There's a basic win condition: walking into a room's door (currently always open, no lock condition) advances to the next room and resets circles/player position for it. Room 1 has a door; room 2 is a minimal dead-end room with no door, just to prove the transition works.
- Added green equilateral triangles (`src/triangle.js`) that rotate to keep a flat edge facing the square, "turning their backs" on it — apex always points away, along whichever axis the square is nearer on. Collision against the player and walls uses exact polygon math (`src/polygon.js`, Separating Axis Theorem), not a circle approximation — confirmed the player stops flush against the triangle's actual edge, not a looser circular boundary.
- Added red hexagons (`src/hexagon.js`) that are "bullies" — stationary, but anything that touches one (player, circles, or triangles) gets shoved away perpendicular to whichever face it hit, rather than just being blocked. Uses exact polygon math throughout: polygon-vs-polygon for the player/triangles, and a new circle-vs-polygon variant (`circlePolygonMTV` in `src/polygon.js`) for circles, since circles have no flat edges of their own. Confirmed a circle pushed into a hexagon's bottom edge moves straight down with zero horizontal drift — a clean perpendicular push.

## Next up
- Implement player-initiated "pushing": right now the player is blocked by circles and triangles but doesn't move them — pushing puzzles need the shape to get shoved when the player walks into it (separate from the hexagon's bully-shove, which already works).
- Decide what a "solved" puzzle looks like within a room (e.g. get a circle to a target spot) — right now a room's door is always open, with no real puzzle gating it yet.
- Build out room 2 (and beyond) with actual content/puzzles, instead of being a dead end.
- Consider whether "flee" behavior still makes sense for a pushing puzzle, or whether some/all shapes should just sit still until pushed.
