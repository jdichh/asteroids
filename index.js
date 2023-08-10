const CANVAS = document.getElementById('canvas')
const CANVAS_CONTEXT = CANVAS.getContext('2d')

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

CANVAS_CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height)