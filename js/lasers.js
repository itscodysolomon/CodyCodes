const container = document.querySelector('#hero');
let followMouse = false; // should eyes follow mouse, follow bug if false

// HELPER FUNCTIONS
const clamp = (min, max, val) => {
    return Math.min(Math.max(min, +val), max);
}

const removeElsByClass = (className) => {
    document.querySelectorAll('.' + className).forEach(e => e.remove());
}

const isMobile = () => {
    return window.innerWidth < 768;
}

// ****** BUG ANIMATION ******
// ***************************
let bugSpeed = 40; // initial speed of bug flying around

//register the gsap plugin
gsap.registerPlugin(MotionPathPlugin);

// set the element to rotate from it's center
gsap.set("#bug", {
    xPercent: -50,
    yPercent: -50,
    transformOrigin: "50% 50%",
});

// animate the bug along 'infinity' path
let bugAnimation = gsap.to("#bug", {
    motionPath: {
        path: "M2.404,150.854c-0,-514.246 800.481,514.245 800.481,-0c-0,-514.246 -800.481,514.245 -800.481,-0Z",
        autoRotate: 90
    },
    duration: bugSpeed,
    repeat: Infinity,
    ease: "linear",
    immediateRender: true,
});

// positions eyes center
const eyesCenter = () => {
    let eyes = document.querySelectorAll('.eye');
    eyes[0].style.transform = 'none';
    eyes[1].style.transform = 'none';
}

// show prize gif when user defeats bugs at all speeds
const showBugMasterGif = () => {
    document.querySelector('#bug-master').style.display = "block";
    setTimeout(function () {
        document.querySelector('#bug-master').style.opacity = "0";
    }, 4000)
    setTimeout(function () {
        document.querySelector('#bug-master').style.display = "none";
    }, 6000);
}

const makeBugFaster = () => {
    if (bugSpeed >= 30) {
        bugSpeed = bugSpeed - 10;
    } else if (bugSpeed > 8) {
        bugSpeed = bugSpeed - 4;
    } else if (bugSpeed > 4) {
        bugSpeed = bugSpeed - 2;
    } else if (bugSpeed == 4) {
        bugSpeed = 40;
        setTimeout(function () {
            showBugMasterGif();
        }, 1000)
    }
    bugAnimation.duration(bugSpeed);
    eyesCenter();
}


// ********** LASERZ **********
// ****************************

const canvas = document.createElement('canvas'); // canvas for lasers
container.appendChild(canvas);

const ctx = canvas.getContext("2d");

let leftEyeCoords, rightEyeCoords;

// used for plotting coordinates of elements on canvas
const setCoords = (el) => {
    const scrollTop = window.pageYOffset;
    return {
        'x': ((el.getBoundingClientRect().right - el.getBoundingClientRect().left) / 2) + el.getBoundingClientRect().left,
        'y': (((el.getBoundingClientRect().bottom - el.getBoundingClientRect().top) / 2) + el.getBoundingClientRect().top) + scrollTop
    }
}

// set canvas height and width, do so on resize and scroll
const initCanvasParams = () => {
    canvas.id = "laser-canvas";
    canvas.height = window.innerHeight;
    canvas.width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}

// set height of hero, also on resize and scroll, especially important for ios navbar issue
const setHeroHeight = () => {
    let winHeight = window.innerHeight;
    document.getElementById("hero").style.height = winHeight + "px";
}

initCanvasParams();

window.addEventListener("DOMContentLoaded", function(){
    // Handler when the DOM is fully loaded
    setHeroHeight();
  });

window.addEventListener('scroll', function() {
    setHeroHeight();
});

window.addEventListener('resize', function() {
    setHeroHeight();
});

// makes a laser on the canvas, one created for each eye in sequence
const generateBeam = (bugCoords, eyeCoords) => {
    const beam = (opts) => {
        ctx.lineWidth = isMobile() ? opts.line_width / 2 : opts.line_width;
        ctx.lineCap = opts.cap;
        ctx.strokeStyle = opts.color;
        ctx.shadowBlur = opts.shadow_size;
        ctx.shadowColor = opts.color;
        ctx.beginPath();
        ctx.moveTo(bugCoords.x, bugCoords.y);
        ctx.lineTo(eyeCoords.x, eyeCoords.y);
        ctx.stroke();
    }

    const beamPoint = (opts) => {
        ctx.shadowBlur = isMobile() ? opts.line_width / 1.5 : opts.line_width;
        ctx.shadowColor = opts.color;
        ctx.fillStyle = opts.color;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.fillStyle = opts.color;
        ctx.beginPath();
        ctx.arc(bugCoords.x, bugCoords.y, isMobile() ? opts.size / 1.5 : opts.size, 0, Math.PI * 2, true);
        ctx.fill();
    }

    beamPoint({
        size: 17,
        shadow_size: 15,
        color: '#2ACDBA'
    });
    beam({
        line_width: 10,
        shadow_size: 10,
        color: '#2ACDBA',
        cap: 'round'
    });
    beam({
        lineWidth: 6,
        shadowSize: 10,
        color: 'turquoise',
        lineCap: 'round'
    });
    beamPoint({
        size: 14,
        shadow_size: 10,
        color: 'turquoise'
    });
}

// laser the bug
const burnBug = (bugCoords) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leftEyeCoords = setCoords(document.querySelector('#left-eye'));
    rightEyeCoords = setCoords(document.querySelector('#right-eye'));

    if (window.innerWidth / 2 > bugCoords.x) {
        generateBeam(bugCoords, leftEyeCoords);
        generateBeam(bugCoords, rightEyeCoords);
    } else {
        generateBeam(bugCoords, rightEyeCoords);
        generateBeam(bugCoords, leftEyeCoords);
    }

    document.querySelector('#bug').style.opacity = "0";
    resurrectTheBug();
}

let laserInterval, laserTimer;

const clearBeams = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(laserInterval);
    clearTimeout(laserTimer);
    makeBugFaster();
}

const resurrectTheBug = () => {
    setTimeout(function () {
        document.querySelector('#bug').style.opacity = "1";
    }, 7000)
}


let lasersActive = false; // used to prevent user from excessive lasering

document.addEventListener('click', function (e) {
    const scrollTop = window.pageYOffset;
    const userClickX = e.clientX;
    const userClickY = e.clientY + scrollTop;
    let bugCoords = setCoords(document.querySelector('#bug'));

    // harder to click precisely on mobile, so give the user some slack
    const getClickAreaThresh = () => {
        if (isMobile()) {
            return 50
        } else {
            return 20
        }
    }
    
    // did the user click close enough to the bug to 'squash' it?
    if ((Math.abs(userClickX - bugCoords.x) < getClickAreaThresh()) && (Math.abs(userClickY - bugCoords.y) < getClickAreaThresh()) && !lasersActive) {
        lasersActive = true;
        document.querySelectorAll('.eye-glow')[0].classList.add('laser-active');
        document.querySelectorAll('.eye-glow')[1].classList.add('laser-active');

        setTimeout(function () {
            laserTimer = setTimeout(function () {
                lasersActive = false;
            }, 700)

            laserInterval = setInterval(function () {
                bugCoords = setCoords(document.querySelector('#bug'));
                if (lasersActive) {
                    burnBug(bugCoords);
                } else {
                    clearBeams();
                    document.querySelectorAll('.eye-glow')[0].classList.remove('laser-active');
                    document.querySelectorAll('.eye-glow')[1].classList.remove('laser-active');
                }
            }, 50);
        }, 1000);
    }
});

window.addEventListener('resize', function () {
    initCanvasParams();
})

window.addEventListener('scroll', function () {
    initCanvasParams();
})

// ******* EYE TRACKING *******
// ****************************

// MUTATION OBSERVABLE 
// used to track the changing position of that bug
const targetNode = document.querySelector("#bug");
const observerOptions = {
    childList: false,
    attributes: true,
    subtree: false
}

const observer = new MutationObserver(function (e) {
    if (window.getComputedStyle(bug).opacity > .15) {
        followMouse = false;
        eyesWatch(targetNode.getBoundingClientRect().left, targetNode.getBoundingClientRect().top)
    } else {
        followMouse = true;
    }
});
observer.observe(targetNode, observerOptions);

// EYES
const eyesWatch = (xCoord, yCoord) => {
    const eyes = document.querySelectorAll('.eye');
    for (let i = 0; i < eyes.length; i++) {
        let currentEye = eyes[i];
        let eyeTrackIntensity = isMobile() ? [20,20] : [65,50];
        currentEye.style.transform = "translate(" + (clamp(-10, 10, ((xCoord) - (currentEye.getBoundingClientRect().left)) / (followMouse ? 120 : eyeTrackIntensity[0]))) + "%, " + ((yCoord) - (currentEye.getBoundingClientRect().top)) / (followMouse ? 90 : eyeTrackIntensity[1]) + "%)";
    }
};

window.addEventListener("mousemove", (e) => {
    if (followMouse) {
        eyesWatch(e.clientX, e.clientY);
    }
});