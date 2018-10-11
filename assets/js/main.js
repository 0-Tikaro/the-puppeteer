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
    $.get( "assets/html/poems.json", function( data ) {
        for(let i = 1; i <= 195; i++) {
            $(".ref" + i).html(data[i]);
            $("#poem" + i).html(data[i]);
        }
    }, "json");
}

function setupVideoEmbeds(){
    $.get( "assets/html/videos.json", function (videosJson) {
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
            title.innerText = videosJson[id].title;

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

//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet at the very start","url":["cjJiO37bidU"]},
//"180511_":{"date":"2018-05-11","title":"Narcolept vs. The Puppet within the first tower","url":["2kFrYPrdKr0"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet under the wyvern","url":["DZLbBIRq40U"]},
//"180511_":{"date":"2018-05-11","title":"Narcolept vs. The Puppet in the second tower","url":["jbJ9CoB-y7g"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet at the final staircase","url":["GNcDfPTHITA"]},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Fanboy vs. The Puppet in High Wall of Lothric</b>","url":["QBaG7tyfHQU"]<div class="youtube" data-embed="3n0HZYTq47E"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="2Fgj5ZECoew"><span class="youtube-title">Boss theme: Vindsvept - Ragnarök, fate of the Gods</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Narcolept vs. Boss in High Wall of Lothric","url":["bUiRuwEtuqM"]},
//"180511_":{"date":"2018-05-11","title":"Narcolept vs. The Puppet by the great pyre and on the bridge","urls":["cPMxBMvmpVE","6pf8HmJKQJo"]"},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Narcolept vs. The Puppet in Undead Settlement</b>","url":["QunWGm56s1I"]<div class="youtube" data-embed="x3YUFFlEwbg"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="okKJN-PNjx0"><span class="youtube-title">Boss theme: Dark Souls III - Unused track 5</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Narcolept vs. Boss in Undead Settlement","url":["TRCV7JyDAAI"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. Boss in Undead Settlement","urls":["T-jfuLnjOXc","DBLjI-xShrM"]"},
//"180511_":{"date":"2018-05-11","title":"Qy vs. The Puppet within the woods","url":["GHA8peGpkWU"]},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Fanboy vs. The Puppet in Crucifixion Woods</b>","url":["DLgAtxExlQU"]<div class="youtube" data-embed="RhW6kuvgefE"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="QCh7C-Xm8JE"><span class="youtube-title">Boss theme: Alex Roe - Lucian, the Devout Spartan</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Qy vs. Boss in Crucifixion Woods","url":["8zvboHv7CgA"]},
//"180511_":{"date":"2018-05-11","title":"Qy vs. The Puppet inside the Cleansing Chapel","url":["vIMNhDMs3MY"]},
//"180511_":{"date":"2018-05-11","title":"Qy vs. The Puppet on the narrow bridge and inside the ladder shortcut","urls":["fcQQr3xPyU8","cyCwCwbb_UQ"]"},
//"180511_":{"date":"2018-05-11","title":"Qy vs. The Puppet on the elevator","url":["9AlP4Abkq84"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet right by the boss","url":["ddpK1YpMUZU"]},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Fanboy vs. Lone Darkwraith's apparition</b>","url":["6YWyMaQM7oY"]<div class="youtube" data-embed="NWY_TNtHi14"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="GCO5QqgQ-qc"><span class="youtube-title">Boss theme: Alex Roe - Viscous Void</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Qy vs. The Puppet getting dirty down in the swamp","url":["lPGdHQkGoBE"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet up by the mausoleum","urls":["mkFmqu1Yx5s","R4xZN1cK6UY"]"},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Fanboy vs. Redflame Erik's apparition</b>","url":["8MxjvYmRdKw"]<div class="youtube" data-embed="D3MRSzYjT0Q"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="kGyTL7uOT9g"><span class="youtube-title">Boss theme: Alex Roe - The Beast of Braildorn</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. Redflame Erik&rsquo;s apparition","url":["io1nEm595Xg"]},
//"180511_":{"date":"2018-05-11","title":"Fanboy vs. The Puppet right at the start of the Catacombs","urls":["t-_NWi17kNc","z6kwT_fBENs"]"},
//"180511_":{"date":"2018-05-11","title":"Fanboy witnessing the Puppet's self-destructive tendencies","url":["YqiNt2Ei19g"]},
//"180511_":{"date":"2018-05-11","title":"Narcolept and Qy vs. The Puppet in the Giant Rat hole","urls":["qhoOdqV2crM","x6AKHHJ_aAw"]"},
//"180511_":{"date":"2018-05-11","title":"<b>BOSS: Fanboy vs. The Puppet</b>","url":["JYcu1WDlIoU"]<div class="youtube" data-embed="qsrnwOQnL_o"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="yIoTZ-L7sIo"><span class="youtube-title">Boss theme: Alex Roe - Gwyar, the Dreg Manifestation</span><div class="play-button"></div></div></div>},
//"180511_":{"date":"2018-05-11","title":"Narcolept facing the scorched Puppet","urls":["U4hIMVyaiYg","SZvt3Hamrwc"]"},
//"180512_":{"date":"2018-05-12","title":"Fanboy's first contact with the Puppet","url":["lMHv8othid4"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy defending himself near the Demon Ruins entrance","url":["bLKc0QLV81g"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy, Jean, Squiggle, and co. giving the Puppet a hard time","url":["bVvfpYD5kAU"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy and Squiggle getting down and dirty","url":["uwv8-uzXWNc"]},
//"180512_":{"date":"2018-05-12","title":"<b>BOSS: The apparition of Wraithflame Erik</b>","url":["E7ggdBZ7cDk"]<div class="youtube" data-embed="HDyXuqFurGc"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="-eJyY2kTtyY"><span class="youtube-title">Boss theme: Dark Souls III - Unused Track 3</span><div class="play-button"></div></div></div>},
//"180512_":{"date":"2018-05-12","title":"Nosferat being "bodied in the lake", per his own words","url":["sGUznKk-rUA"]},
//"180512_":{"date":"2018-05-12","title":"Narcolept witnessing the Puppet's divine skills","url":["7qqCAkursos"]},
//"180512_":{"date":"2018-05-12","title":"Qy and co. in the high-speed murder-blender action","url":["urqRDlW-FJw"]},
//"180512_":{"date":"2018-05-12","title":"Narcolept going toe-to-toe with the Puppet","url":["1AqS0nAtn44"]},
//"180512_":{"date":"2018-05-12","title":"<b>BOSS: Meek apparition of White Vagrant</b>","url":["HBcgiURxTC8"]<!--todo irithyll boss missing original video--><div class="youtube" data-embed="xxx"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="A-JfjfurFaE"><span class="youtube-title">Boss theme: Alex Roe - Soul Reaper Kane</span><div class="play-button"></div></div></div>},
//"180512_":{"date":"2018-05-12","title":"Nosferat fighting valiantly from the land Down Under","url":["ppu4O_Fx6HE"]},
//"180512_":{"date":"2018-05-12","title":"Narcolept fighting the Puppet as it&rsquo;s engaged in pest control","url":["5VOx7LYTx6I"]},
//"180512_":{"date":"2018-05-12","title":"<b>BOSS: The apparition of Slumbering Oden</b>","url":["8RoxvQcS-g8"]<div class="youtube" data-embed="Y9e_G3OkBRM"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="RWUe_-QM2EM"><span class="youtube-title">Boss theme: Alex Roe - The Grosvenor Manor</span><div class="play-button"></div></div></div>},
//"180512_":{"date":"2018-05-12","title":"Fanboy's first encounter with the scalding Puppet","url":["efsSoX8hgdI"]},
//"180512_":{"date":"2018-05-12","title":"Narcolept and chimeraBlood in a hectic showdown","url":["vC6ZNxMP21g"]},
//"180512_":{"date":"2018-05-12","title":"Narcolept, Necrow, and PvE bullying the Puppet","url":["6vftI48E0KU"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy fighting a long war of attrition","url":["k0NxKymwUts"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy stopping the Puppet before the giant","url":["pwMvxORBhV0"]},
//"180512_":{"date":"2018-05-12","title":"Lone Fanboy stopping the Puppet from engaging the wyvern","url":["vS16hPSJIFs"]},
//"180512_":{"date":"2018-05-12","title":"The Puppet repaying Fanboy with double the ruthlessness","url":["4pYttHpjJWI"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy, Narcolept, and Aurora in a war of attrition","url":["SIYUvQhcPuM"]},
//"180512_":{"date":"2018-05-12","title":"Fanboy seeing his comrades fall and leave him alone","url":["6xrYVjngt10"]},
//"180512_":{"date":"2018-05-12","title":"<b>BOSS: The apparition of Lord of Hail</b>","url":["5Aw67xTzPFk"]<div class="youtube" data-embed="e6BNS88pDjs"><span class="youtube-title">Original clip</span><div class="play-button"></div><div class="youtube" data-embed="NZSePnGqFRI"><span class="youtube-title">Boss theme: Alex Roe - Coventina, Safeguard of the Lake</span><div class="play-button"></div></div></div>},
//"180512_":{"date":"2018-05-12","title":"Fanboy enduring almost seven minutes (Fanboy's music)","url":["JVZkOwaFbFQ"]<!--todo add puppet journey 3 videos--><i class="material-icons icon-expand">priority_high</i><i class="material-icons f-l">audiotrack</i>},
//}