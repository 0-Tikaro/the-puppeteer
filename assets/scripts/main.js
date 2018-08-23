// Counter holds amount of html pages loaded. Only when everything is loaded will the rest of the code fire.
let loadedCount = 0;
function incrementLoadedCount() {
    loadedCount += 1;
}


// Adding references to poems.
function setupPoemLinks(){
    for(let i = 1; i <= 195; i++) {
        $(".ref" + i).html($("#poem" + i).html());
    }
}

// Setup collapsible elements.
function createCollapsibles() {
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function createYoutubeEmbeds() {
    let youtube = document.querySelectorAll(".youtube");
    for (let i = 0; i < youtube.length; i++) {
        let source = "https://img.youtube.com/vi/" + youtube[i].dataset.embed + "/sddefault.jpg";
        let image = new Image();
        image.src = source;
        image.addEventListener("load", function() {
            youtube[i].appendChild(image);
        }(i));
        youtube[i].addEventListener("click", function() {
            let iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("src", "https://www.youtube.com/embed/" + this.dataset.embed + "?rel=0&showinfo=0&autoplay=1");
            this.innerHTML = "";
            this.appendChild(iframe);
        });
    };
}


let titleElement = $('.title-text')
let lastScrollPos = 0;
let idList = ["#synopsis_content",
    "#c171200",
    "#c180120",
    "#c180121",
    "#c180127",
    "#c180203",
    "#c180206",
    "#c180209",
    "#c180225",
    "#c180310",
    "#c180312",
    "#c180325",
    "#c180330",
    "#c180401",
    "#c180418",
    "#c180428",
    "#c180511",
    "#c180512",
    "#c180513",
    "#q_and_a",
    "#closing_thoughts",
    "#characters_content",
    "#poems_content",
    "#video_content"];


function onScroll(event){
    let curScrollPos = $(document).scrollTop();
    idList.forEach( function (id) {
        let element = $(id);
        let elementPos = element.position().top;
        if (elementPos > lastScrollPos && elementPos <= curScrollPos) {
            //Changing the title
            titleElement.addClass("title-transition")
            setTimeout(function() {
                titleElement.text(element.text())
                titleElement.removeClass("title-transition")
            }, 550);
        }
    });
    lastScrollPos = curScrollPos;
}


/*MAIN CODE*/
$("#poems_content").load("assets/html/poems.html", incrementLoadedCount);
$("#characters_content").load("assets/html/characters.html", incrementLoadedCount);
$("#video_content").load("assets/html/video.html", incrementLoadedCount);
$("#synopsis_content").load("assets/html/synopsis.html", incrementLoadedCount);
$("#chronology_content").load("assets/html/chronology.html", incrementLoadedCount);


// wait until all content has been loaded.
function checkContentLoaded() {
    if(loadedCount === 5) {
        clearTimeout(checkContentLoaded);

        setupPoemLinks();
        createCollapsibles();
        createYoutubeEmbeds();

    } else {
        window.setTimeout(checkContentLoaded, 1000);
    }
}
checkContentLoaded();

$(document).on("scroll", onScroll);