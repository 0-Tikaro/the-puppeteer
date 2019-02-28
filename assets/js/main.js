/**
 * JS logic for The Puppeteer website.
 *
 * @author: Tikaro
 */
const VIDEO_EMBEDS_TOOLTIP = "Click to show/hide video footage"

const NIGHT_MODE_COOKIE = 'use-night-mode'
const NIGHT_MODE_DISABLED = "Disable night mode"
const NIGHT_MODE_ENABLED = "Enable night mode"

const POEM_COUNT = 195;


let isTitlePage = document.location.href.includes('index.html');

let poemsJsonPath = 'assets/json/poems.json';
let videoJsonPath = 'assets/json/videos.json';
let chaptersJsonPath = 'assets/json/chapter-titles.json';


function injectChapterInfo(json){
    let titleInjectTargets = document.querySelectorAll('.title-inject');
    let dateInjectTargets = document.querySelectorAll('.date-updated-inject');

    titleInjectTargets.forEach(target => {
        let id = target.getAttribute('data-chapter');
        target.innerHTML = json[id].name;
    });

    dateInjectTargets.forEach(target => {
        let id = target.getAttribute('data-chapter');
        target.innerHTML = json[id].update;
    });
}

function setupPoemLinks(json){
    for(let i = 1; i <= POEM_COUNT; i++) {
        $('.ref' + i).html(json[i]);
        $('#poem' + i).html(json[i]);
    }
}

function setupVideoEmbeds(json){
    let videos = document.querySelectorAll('.video');

    videos.forEach(element => {
        let id = element.getAttribute('data-id');
        let button = createCollapsibleButton(json[id]);
        let collapsibleContent = createCollapsibleContent(json[id]);
        element.appendChild(button);
        element.appendChild(collapsibleContent);
    });

    setupCollapsiblesEventListeners();
    setupYoutubeEmbeds();
}

function createCollapsibleButton(collapsibleData) {
    let button = document.createElement('button');
    button.classList.add('collapsible');
    button.setAttribute('title', VIDEO_EMBEDS_TOOLTIP);

    let date = document.createElement('span');
    button.appendChild(date);
    date.classList.add('video-date');
    date.innerText = collapsibleData.date;

    let title = document.createElement('span');
    button.appendChild(title);
    title.innerHTML = collapsibleData.title;
    if (collapsibleData.style == 'bold'){
        title.classList.add('text-bold');
    }

    let icon = document.createElement('i');
    button.appendChild(icon);
    icon.classList.add('material-icons');
    icon.classList.add('icon-expand');
    icon.classList.add('f-r');
    icon.innerText = 'expand_more';

    return button;
}

function createCollapsibleContent(collapsibleData) {
    let collapsibleContent = document.createElement('div');
    collapsibleContent.classList.add('collapsible-content');

    collapsibleData.clips.forEach(clipData => {
        let clip = document.createElement('div');
        collapsibleContent.appendChild(clip);
        clip.classList.add('youtube');
        clip.setAttribute('data-embed', clipData.url);

        let playButton = document.createElement('div');
        clip.appendChild(playButton);
        playButton.classList.add('play-button');
        
        if (clipData.title){
            let clipTitle = document.createElement('span');
            clipTitle.classList.add('youtube-title');
            clipTitle.innerText = clipData.title;
            clip.appendChild(clipTitle);
        }
    });

    return collapsibleContent;
}

function setupCollapsiblesEventListeners() {
    let collapsibles = document.querySelectorAll('.collapsible');

    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');

            let arrow = $(this).find('.icon-expand');
            let content = this.nextElementSibling;

            if (content.style.display === 'block') {
                content.style.display = 'none';
                arrow.html('expand_more');
            } else {
                content.style.display = 'block';
                arrow.html('expand_less');

            }
        });
    });
}

function setupYoutubeEmbeds() {
    let youtube = document.querySelectorAll('.youtube');
    youtube.forEach(element => {
        let embedCode = element.getAttribute('data-embed');
        let source = 'https://img.youtube.com/vi/' + embedCode + '/sddefault.jpg';

        let image = new Image();
        image.src = source;
        image.addEventListener('load', function() {
            element.appendChild(image);
        });

        element.addEventListener('click', function() {
            let iframe = document.createElement('iframe');
            let embedCode = this.getAttribute('data-embed');
            iframe.setAttribute('frameborder', "0");
            iframe.setAttribute('allowfullscreen', "");
            iframe.setAttribute('src', "https://www.youtube.com/embed/" + embedCode + "?rel=0&showinfo=0&autoplay=1");
            this.innerHTML = "";
            this.appendChild(iframe);
        });
    });
}

function enableSidebarControls() {
    let $sidebarButton = $('#btn-show-sidebar');
    let $sidebar = $('#sidebar');

    $sidebarButton.on('click', function () {
        $sidebar.toggleClass('expand-sidebar');
        $sidebarButton.toggleClass('expand-sidebar');
        
        if ($sidebarButton.hasClass('expand-sidebar')){
            $sidebarButton.html('<i class="material-icons">close</i>')
        } else {
            $sidebarButton.html('<i class="material-icons">menu</i>')
        }
    });
}

function enableNightMode() {
    let $nightModeButton = $('#night');

    if (document.cookie.includes(NIGHT_MODE_COOKIE + '=1')) {
        document.body.setAttribute('class', 'night-mode');
        $nightModeButton.html(NIGHT_MODE_DISABLED);
    } else {
        $nightModeButton.html(NIGHT_MODE_ENABLED);
    }

    $nightModeButton.on('click', function () {
        document.body.classList.toggle('night-mode');
        if ($nightModeButton.html() === NIGHT_MODE_ENABLED) {
            $nightModeButton.html(NIGHT_MODE_DISABLED);
            document.cookie = NIGHT_MODE_COOKIE + '=1;path=/';
        } else {
            $nightModeButton.html(NIGHT_MODE_ENABLED);
            document.cookie = NIGHT_MODE_COOKIE + '=0;path=/';
        }
    });
}

function main() {
    if (!isTitlePage) {
        poemsJsonPath = '../' + poemsJsonPath;
        videoJsonPath = '../' + videoJsonPath;
        chaptersJsonPath = '../' + chaptersJsonPath;

        Hyphenator.run();

        $.get(poemsJsonPath, setupPoemLinks, 'json');
        $.get( videoJsonPath, setupVideoEmbeds, 'json');
    }

    $.get(chaptersJsonPath, injectChapterInfo, 'json');

    enableSidebarControls();
    enableNightMode();
}

main();