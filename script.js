let sky = document.querySelector('.sky');
let stars = 250;
let size = 5;


function random(range, unit) {
    let randNum = Math.floor(Math.random() * range) + 1;
    return `${randNum}${unit}`;
}

function createStar(size) {

    let circle = document.createElement('div');
    circle.classList.add('circle');

    let randRange5 = Math.floor(Math.random() * 5) + 1;
    circle.classList.add(`blink_${randRange5}`);

    let widthAndHeight = random(size, 'px');
    circle.style.height = circle.style.width = widthAndHeight;

    circle.style.left = random(document.body.clientWidth, 'px');
    circle.style.top = random(document.body.clientHeight, 'px');

    sky.appendChild(circle);
}


function paintStars(stars, size) {
    while (sky.firstChild) {
        sky.removeChild(sky.firstChild);
    }
    for (let i = 0; i < stars; i++) {
        createStar(size);
    }
}

paintStars(stars, size);