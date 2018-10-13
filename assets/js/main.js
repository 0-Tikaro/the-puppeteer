// temp storage
// material video icon svg
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm6 10h-4V5h4v14zm4-2h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
// menu
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
// excl
// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/><path fill="none" d="M0 0h24v24H0z"/></svg>


// Counter holds amount of html pages loaded. Only when everything is loaded will the rest of the code fire.
let loadedCount = 0;
function incrementLoadedCount() {
    loadedCount += 1;
}


// Adding references to poems.
function setupPoemLinks(){
    $.get( "assets/json/poems.json", function( data ) {
        for(let i = 1; i <= 195; i++) {
            $(".ref" + i).html(data[i]);
            $("#poem" + i).html(data[i]);
        }
    }, "json");
}

function setupVideoEmbeds(){
    $.get( "assets/json/videos.json", function (videosJson) {
        let videos = document.querySelectorAll(".video");
        for (let i = 0; i < videos.length; i++) {
            let id = videos[i].dataset.id;

            //button setup
            let button = document.createElement("button");
            button.classList.add("collapsible");

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


let titleElement = $('.title-text')
let elPrevChapter = $( '#chapter-prev' )
let elNextChapter = $( '#chapter-next' )
let lastScrollPos = 0;
let curIdIndex = -1;
let idList = [
    "#top",
    "#synopsis_content",
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
    "#video_content"
];

function generateTableOfContent(){
    let cList = $( '#chapter-list' );
    idList.forEach( function (id) {
        let element = $(id);
        let li = $('<li/>')
            .appendTo(cList);
        let aaa = $('<a/>')
            .attr('href', id)
            .text( element.find(".chapter-title").text() )
            .appendTo(li);
    });
}

function onScroll(){
    let curScrollPos = $(document).scrollTop();
    idList.forEach( function (id, index) {
        let element = $(id);

        let elementPos = element.offset().top;
        let elementHeight = element.height();
        let posOffset = $(window).height() / 3 * -1;

        let breakpoint0 = elementPos + posOffset;
        let breakpoint1 = elementPos + posOffset + elementHeight;

        if (curScrollPos >= breakpoint0 && curScrollPos <= breakpoint1 && index != curIdIndex) {
            curIdIndex = index;

            let indexPrev;
            let indexNext;

            if (index - 1 < 0) {
                indexPrev = 0;
                elPrevChapter.css( 'opacity', '0' );
            } else {
                indexPrev = index - 1;
                elPrevChapter.css( 'opacity', '' );
            }

            if (index + 1 > idList.length - 1) {
                indexNext = idList.length - 1;
                elNextChapter.css( 'opacity', '0' );
            } else {
                indexNext = index + 1;
                elNextChapter.css( 'opacity', '' );
            }

            elPrevChapter.attr( 'href', idList[indexPrev] );
            elNextChapter.attr( 'href', idList[indexNext] );

            //Changing the title
            titleElement.addClass("title-transition");
            titleElement.removeClass("title-text");
            setTimeout(function() {
                titleElement.text( element.find(".chapter-title").text() );
                titleElement.removeClass("title-transition");
                titleElement.addClass("title-text");
            }, 300);
        }
    });
    lastScrollPos = curScrollPos;
}


function curlies(element) {
    function smarten(text) {
        return text
        /* opening singles */
            .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")

            /* closing singles & apostrophes */
            .replace(/'/g, "\u2019")

            /* opening doubles */
            .replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c")

            /* closing doubles */
            .replace(/"/g, "\u201d")

            /* em-dashes */
            .replace(/--/g, "\u2014");
    };

    var children = element.children;

    if (children.length) {
        for(var i = 0, l = children.length; i < l; i++) {
            curlies(children[i]);
        }
    } else {
        element.innerHTML = smarten(element.innerHTML);
    }
};


/*MAIN CODE*/
let useNightModeCookie = document.cookie;
let nightModeButton = $( '#night' );
if (useNightModeCookie.includes("use-night-mode=1")){
    document.body.setAttribute('class', 'night-mode');
    nightModeButton.html('Day mode');
}

$("#poems_content").load("assets/html/poems.html", incrementLoadedCount);
$("#characters_content").load("assets/html/characters.html", incrementLoadedCount);
$("#video_content").load("assets/html/video.html", incrementLoadedCount);
$("#intro_content").load("assets/html/intro.html", incrementLoadedCount);
$("#synopsis_content").load("assets/html/synopsis.html", incrementLoadedCount);
$("#chronology_content").load("assets/html/chronology.html", incrementLoadedCount);


// wait until all content has been loaded.
function checkContentLoaded() {
    if(loadedCount === 6) {
        clearTimeout(checkContentLoaded);

        generateTableOfContent();
        setupPoemLinks();
        setupVideoEmbeds();
        // createCollapsibles();
        // createYoutubeEmbeds();

        $(document).on('scroll', onScroll);
        onScroll();

        let showSidebarMenu =  $( '#menu-show' );
        let sidebarMenu = $( '#sidebar-menu' );
        let btnHideSidebar = $( '#btn-hide-sidebar');
        let btnShowSidebar = $( '#btn-show-sidebar');

        showSidebarMenu.on( 'click', function () {
            if ( showSidebarMenu.html() === 'Show table of content') {
                showSidebarMenu.html('Hide table of content');
                sidebarMenu.css( 'display', 'unset' );
            } else {
                showSidebarMenu.html('Show table of content');
                sidebarMenu.css( 'display', 'none' );
            }
        });

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

        btnHideSidebar.on('click', function () {
            $('#sidebar').toggleClass('no-distraction');
            $('#content').toggleClass('no-distraction');
            btnShowSidebar.toggleClass('no-distraction');
        });
        btnShowSidebar.on('click', function () {
            $('#sidebar').toggleClass('no-distraction');
            $('#content').toggleClass('no-distraction');
            btnShowSidebar.toggleClass('no-distraction');
        });

        $( '.collapsible' ).attr('title', 'Click to expand a video');


    } else {
        window.setTimeout(checkContentLoaded, 100);
    }
}
checkContentLoaded();
