const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const stroke_weight = document.getElementById('pen-size');
const color_picker = document.getElementById('color-picker-input');
const colorCircle = document.querySelectorAll(".color-circle");
const clearButton = document.getElementById('clear-button');
const downloadButton = document.getElementById('download-button');
let isDrawing = false;
let pickedColor = color_picker.value;
let restore_array = [];
let index = -1;

//event listner for mobile
const menu = document.querySelector('.hamburger-menu');
menu.addEventListener('click', () => {
    const tool_bar = document.querySelector('.tool-bar');
    if(tool_bar.classList.contains('not-in-use'))
        tool_bar.classList.remove('not-in-use');
    else
        tool_bar.classList.add('not-in-use');
});

//resizing canvas element
window.addEventListener('resize', resizeCanvas);
function resizeCanvas () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

//canvas events
canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);

canvas.addEventListener('touchstart', startForTouch, false);
canvas.addEventListener('touchmove', drawForTouch, false);
canvas.addEventListener('touchend', stopForTouch, false);

clearButton.addEventListener('click', clearCanvas);

//function for downloading image
downloadButton.addEventListener('click', (e) => {
    //IE/Edge support (PNG only)
    if(window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "drawing.png");
    } else {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.download = "drawing.png";
        a.click();
        document.body.removeChild(a);
    }
});

//eraser tool function
let isErasing = false;
const eraser = document.querySelector('.erase');
function erase(e) {
        ctx.beginPath();
        ctx.globalCompositeOperation="destination-out";
        ctx.arc(e.clientX, e.clientY, 8, 0, Math.PI*2, false);
        ctx.fill();
}
function stopErasing(e) {
    if(isErasing) {
        isErasing = false;
        ctx.globalCompositeOperation="source-over";
        ctx.beginPath;
    }
}
eraser.addEventListener('click', (e) => {
    if(!isErasing) {
        isErasing = true;
        erase(e)
    } else stopErasing(e); 
});

//function for uploading
const reader = new FileReader();
const img = new Image();
const uploadImage = (e) => {
    reader.onload = () => {
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0])
};
const imageLoader = document.getElementById('uploader');
imageLoader.addEventListener('change', uploadImage);


//drawing functions
function start (e) {
    isDrawing = true;
    draw(e);
}

function startForTouch (e) {
    isDrawing = true;
    draw(e);
}
  
function draw ({clientX: x, clientY: y}) {
    if (!isDrawing) return;
    ctx.lineWidth = stroke_weight.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = pickedColor;  
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function drawForTouch (e) {
    if (!isDrawing) return;

    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;

    ctx.lineWidth = stroke_weight.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = pickedColor;  
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}
  
function stop (e) {
    if(isDrawing) {
        isDrawing = false;
        ctx.beginPath();
    }
    if(e.type != 'mouseout') {
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

function stopForTouch (e) {
    if(isDrawing) {
        isDrawing = false;
        ctx.beginPath();
    }
    restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
}
  
function clearCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restore_array = [];
    index = -1;
}

function undo() {
    if(index <= 0) clearCanvas();
    else {
        index -= 1;
        restore_array.pop();
        ctx.putImageData(restore_array[index], 0, 0);
    }
}

function selectColor (elem) {
    removeActiveCircleColor();
    pickedColor = elem.getAttribute("data-color");
    elem.classList.add("active");
}

const removeActiveCircleColor = () => {
    colorCircle.forEach((circle) => {
      circle.classList.remove("active");
    });
};

function colorPicker(elem) {
    removeActiveCircleColor();
    pickedColor = elem.value;
}