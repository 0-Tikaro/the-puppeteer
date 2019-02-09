// temp storage
// material video icon svg
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm6 10h-4V5h4v14zm4-2h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
// menu
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
// excl
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/><path fill="none" d="M0 0h24v24H0z"/></svg>

let VIDEO_EMBEDS_TOOLTIP = "Click to show/hide video footage"

let isTitlePage = document.location.href.includes("index.html");

let poemsDataFilepath = "assets/json/poems.json";
let videoDataFilepath = "assets/json/videos.json";
let chapterTitleDataFilepath = "assets/json/chapter-titles.json";
if (!isTitlePage){
    poemsDataFilepath = "../" + poemsDataFilepath;
    videoDataFilepath = "../" + videoDataFilepath;
    chapterTitleDataFilepath = "../" + chapterTitleDataFilepath;
}

function setupPoemLinks(){
    $.get(poemsDataFilepath, function(data) {
        for(let i = 1; i <= 195; i++) {
            $(".ref" + i).html(data[i]);
            $("#poem" + i).html(data[i]);
        }
    }, "json");
}

function setupVideoEmbeds(){
    $.get( videoDataFilepath, function (videosJson) {
        let videos = document.querySelectorAll(".video");
        for (let i = 0; i < videos.length; i++) {
            let id = videos[i].dataset.id;

            //button setup
            let button = document.createElement("button");
            button.classList.add("collapsible");
            button.setAttribute("title", VIDEO_EMBEDS_TOOLTIP);

            let date = document.createElement("span");
            date.classList.add("video-date");
            date.innerText = videosJson[id].date;

            let title = document.createElement("span");
            if (videosJson[id].style === "bold"){
                title.innerHTML = "<b>"+videosJson[id].title+"</b>";
            } else {
                title.innerText = videosJson[id].title;
            }


            let icon = document.createElement("i");
            icon.classList.add("material-icons");
            icon.classList.add("icon-expand");
            icon.classList.add("f-r");
            icon.innerText = "expand_more";

            button.appendChild(date);
            button.appendChild(title);
            button.appendChild(icon);

            videos[i].appendChild(button);

            let collapsible_content = document.createElement("div");
            collapsible_content.classList.add("collapsible_content");

            for(let j = 0; j < videosJson[id].clips.length; j++){

                let clip = document.createElement("div");
                let playButton = document.createElement("div");

                clip.classList.add("youtube");
                clip.dataset.embed = videosJson[id].clips[j].url;

                if (videosJson[id].clips[j].title !== ""){
                    let clipTitle = document.createElement("span");
                    clipTitle.classList.add("youtube-title");
                    clipTitle.innerText = videosJson[id].clips[j].title;
                    clip.appendChild(clipTitle);
                }
                playButton.classList.add("play-button");
                clip.appendChild(playButton);

                collapsible_content.appendChild(clip);
            }

            videos[i].appendChild(collapsible_content);
        };
        createCollapsibles();
        createYoutubeEmbeds();
    }, "json");
}

// Setup collapsible elements.
function createCollapsibles() {
    let coll = document.getElementsByClassName("collapsible");

    for (let i = 0; i < coll.length; i++) {

        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");

            let arrow = $(this).find(".icon-expand");
            let content = this.nextElementSibling;

            if (content.style.display === "block") {
                content.style.display = "none";
                arrow.html('expand_more');
            } else {
                content.style.display = "block";
                arrow.html('expand_less');

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

function injectChapterInfo(){
    $.get(chapterTitleDataFilepath, function(titles) {
        $( '.title-inject' ).each( function(){
            let id = $(this).data("chapter");
            $(this).text(titles[id].name);
        });
        $( '.date-updated-inject' ).each( function(){
            let id = $(this).data("chapter");
            $(this).text(titles[id].update);
        });
    }, "json");
}

function main() {
    let useNightModeCookie = document.cookie;
    let nightModeButton = $('#night');
    let btnShowSidebar = $('#btn-show-sidebar');

    if (useNightModeCookie.includes("use-night-mode=1")) {
        document.body.setAttribute('class', 'night-mode');
        nightModeButton.html('Day mode');
    }

    if (!isTitlePage) {
        Hyphenator.run();
        setupPoemLinks();
        setupVideoEmbeds();
    }

    injectChapterInfo();


    nightModeButton.on('click', function () {
        document.body.classList.toggle('night-mode');
        if (nightModeButton.html() === 'Night mode') {
            nightModeButton.html('Day mode');
            document.cookie = "use-night-mode=1";
        } else {
            nightModeButton.html('Night mode');
            document.cookie = "use-night-mode=0";
        }
    });

    let expandSidebarClass = 'expand-sidebar';

    btnShowSidebar.on('click', function () {
        $('#sidebar').toggleClass(expandSidebarClass);
        btnShowSidebar.toggleClass(expandSidebarClass);
        if (btnShowSidebar.hasClass(expandSidebarClass)){
            btnShowSidebar.html('<i class="material-icons">close</i>')
        } else {
            btnShowSidebar.html('<i class="material-icons">menu</i>')
        }
    });

    $('.collapsible').attr('title', 'Click to expand a video');
}

main();