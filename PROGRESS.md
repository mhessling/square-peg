# Progress

## Where things stand
- Pivoted from a platformer to a **puzzle game**: the square moves around a map and solves puzzles by pushing/interacting with other shapes, using the movement/collision mechanics already built.
- Square moves and jumps (jump may become less relevant now that it's not a platformer — revisit later).
- Circles flinch then flee when the square approaches.
- Square collides solidly with circles (no pass-through) — this is the basis for "pushing" them around in puzzles.
- Level is currently just a flat floor (`src/level.js`) with no walls, bounds, or goal — a holdover from the platformer phase.

## Next up
- Build a basic map: walls/bounds for a puzzle space (not just an infinite flat floor), and a way to define map layout data (e.g. a simple grid or list of obstacles) separate from rendering.
- Decide what a "solved" puzzle looks like (e.g. get a circle to a target spot) — needed before maps mean anything.
- Revisit whether jumping still belongs in a puzzle game, or whether movement should become pure top-down/4-directional.
