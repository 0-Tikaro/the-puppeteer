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
let elPrevChapter = $( '#chapter-prev' )
let elNextChapter = $( '#chapter-next' )
let lastScrollPos = 0;
let curIdIndex = -1;
let idList = [
    "#intro_content",
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
                elPrevChapter.css( 'opacity', '1' );
            }

            if (index + 1 > idList.length - 1) {
                indexNext = idList.length - 1;
                elNextChapter.css( 'opacity', '0' );
            } else {
                indexNext = index + 1;
                elNextChapter.css( 'opacity', '1' );
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


/*MAIN CODE*/
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
        createCollapsibles();
        createYoutubeEmbeds();

        $(document).on('scroll', onScroll);
        onScroll();

        let showSidebarMenu =  $( '#menu-show' );
        let sidebarMenu = $( '#sidebar-menu' );
        showSidebarMenu.on( 'click', function () {
            if ( showSidebarMenu.html() === 'Show table of content') {
                showSidebarMenu.html('Hide table of content');
                sidebarMenu.css( 'display', 'unset' );
            } else {
                showSidebarMenu.html('Show table of content');
                sidebarMenu.css( 'display', 'none' );
            }
        });

    } else {
        window.setTimeout(checkContentLoaded, 100);
    }
}
checkContentLoaded();

