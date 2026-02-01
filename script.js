fetchJSON();

function fetchJSON() {
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            setNavContent(data);
            preloadImages(data);
        })
        .catch(error => console.error('Failed to fetch data:', error));
}

let clicked = false;
let prevIndex = -1;

document.querySelectorAll(".overlay").forEach(overlay => {
    const home = overlay.closest(".home");
    const pads = home.querySelectorAll(".pad");
    overlay.addEventListener("mousemove", e => {

        if (clicked) {
            return;
        }

        const mouseX = e.clientX;
        const padWidth = overlay.offsetWidth;
        const index = Math.floor(mouseX / padWidth);


        if (index === prevIndex) {
            return;
        }

        prevIndex = index;

        overlay.classList.add("hover");
        for (let i = 0; i < pads.length; i++) {
            if (i == index) {
                if (pads[i].classList.contains("hover")) {
                    continue;
                }
                pads[i].classList.add("hover");
            }
            else {
                if (pads[i].classList.contains("hover")) {
                    pads[i].classList.remove("hover");
                }
            }
        }
    });
    overlay.addEventListener("mouseleave", e => {
        if (clicked) {
            return;
        }
        pads.forEach(p => p.classList.remove("hover"));
        overlay.classList.remove("hover");
        prevIndex = -1;
    });

    overlay.addEventListener("click", e => {
        clicked = !clicked;
        if (clicked) {
            showCustomAlert("You have clicked on the pads. Hover effects are now disabled. Click on any pad again to re-enable hover effects.");
        }
        else {
            showCustomAlert("Hover effects have been re-enabled. You can now hover over the pads again.");
        }
    });
});

document.getElementById("entrance").addEventListener("click", entranceClick);

function entranceClick() {
    document.getElementById("entrance").classList.add("clicked");
    document.getElementById("home").classList.add("clicked");
}

function setNavContent(data) {
    let cons = document.querySelectorAll(".con");
    cons.forEach(con => {
        con.addEventListener("mouseenter", e => {

            if (clicked) {
                return;
            }
            document.getElementById("text").innerHTML = data[con.id];
            for (let i = 0; i < 3; i++) { 
                document.getElementById(con.id + "pic" + i).classList.remove("hide");
                document.getElementById("default" + "pic" + i).classList.add("hide");
            }
        });
        con.addEventListener("mouseleave", e => {
            if (clicked) {
                return;
            }

            for (let i = 0; i < 3; i++) {
                document.getElementById(con.id + "pic" + i).classList.add("hide");
                document.getElementById("default" + "pic" + i).classList.remove("hide");
            }
            document.getElementById("text").innerHTML = data["default"];
        });
    });
}

// Source - https://stackoverflow.com/q
// Posted by Francisc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-28, License - CC BY-SA 4.0
function preloadImage(url, pad, id, i) {
    const padimg = pad.appendChild(document.createElement("img"));
    padimg.className = "padimg";
    padimg.id = id + "pic" + i;
    padimg.src = url;
    padimg.classList.add("hide");
    pad.appendChild(padimg);
}

function preloadImages(data) {
    const pads = document.querySelectorAll(".pad");
    document.querySelectorAll(".con").forEach(con => {
        for (let i = 0; i < pads.length; i++) {
            preloadImage(data[con.id + "pics"][i], pads[i], con.id, i);
        }

    });
    for (let i = 0; i < pads.length; i++) {
        preloadImage(data["defaultpics"][i], pads[i], "default", i);
    }
}

function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.classList.add('show'), 10);
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => alertBox.remove(), 300);
    }, 3000);
}