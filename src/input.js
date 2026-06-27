// Tracks which keys are currently held down, so other files can ask "is left pressed?"
const keys = {};

window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
