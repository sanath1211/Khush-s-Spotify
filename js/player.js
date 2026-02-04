(function () {
    'use strict';

    var app = document.querySelector('.app');
    var footer = document.getElementById('playerFooter');
    var audio = document.getElementById('playerAudio');
    var playerCover = document.getElementById('playerCover');
    var playerTitle = document.getElementById('playerTitle');
    var playerArtist = document.getElementById('playerArtist');
    var btnPlay = document.getElementById('btnPlay');
    var btnPrev = document.getElementById('btnPrev');
    var btnNext = document.getElementById('btnNext');
    var btnShuffle = document.getElementById('btnShuffle');
    var btnRepeat = document.getElementById('btnRepeat');
    var playerProgress = document.getElementById('playerProgress');
    var playerTimeCurrent = document.getElementById('playerTimeCurrent');
    var playerTimeTotal = document.getElementById('playerTimeTotal');
    var playerVolume = document.getElementById('playerVolume');

    var cards = document.querySelectorAll('.song-card');
    var currentIndex = -1;
    var isPlaying = false;
    var searchInput = document.getElementById('searchInput');
    var searchNoResults = document.getElementById('searchNoResults');

    function showFooter() {
        footer.classList.add('player-footer--visible');
        footer.setAttribute('aria-hidden', 'false');
        if (app) app.classList.add('app--player-visible');
    }

    function isCardVisible(card) {
        return !card.classList.contains('song-card--hidden');
    }

    function getVisibleIndices() {
        var indices = [];
        for (var i = 0; i < cards.length; i++) {
            if (isCardVisible(cards[i])) indices.push(i);
        }
        return indices;
    }

    function getNextVisibleIndex() {
        var visible = getVisibleIndices();
        if (visible.length === 0) return -1;
        var idx = visible.indexOf(currentIndex);
        if (idx < 0) return visible[0];
        return visible[(idx + 1) % visible.length];
    }

    function getPrevVisibleIndex() {
        var visible = getVisibleIndices();
        if (visible.length === 0) return -1;
        var idx = visible.indexOf(currentIndex);
        if (idx <= 0) return visible[visible.length - 1];
        return visible[idx - 1];
    }

    function filterCardsBySearch() {
        var query = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
        var hasMatch = false;
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var titleEl = card.querySelector('.song-card-title');
            var artistEl = card.querySelector('.song-card-artist');
            var title = (titleEl && titleEl.textContent) ? titleEl.textContent.toLowerCase() : '';
            var artist = (artistEl && artistEl.textContent) ? artistEl.textContent.toLowerCase() : '';
            var match = !query || title.indexOf(query) !== -1 || artist.indexOf(query) !== -1;
            if (match) {
                card.classList.remove('song-card--hidden');
                hasMatch = true;
            } else {
                card.classList.add('song-card--hidden');
            }
        }
        if (searchNoResults) {
            if (query && !hasMatch) {
                searchNoResults.hidden = false;
            } else {
                searchNoResults.hidden = true;
            }
        }
    }

    function setTrack(index) {
        if (index < 0 || index >= cards.length) return;
        currentIndex = index;
        var card = cards[currentIndex];
        var img = card.querySelector('.song-card-img');
        var titleEl = card.querySelector('.song-card-title');
        var artistEl = card.querySelector('.song-card-artist');
        var audioSrc = card.getAttribute('data-audio') || '';

        var coverSrc = img && img.src ? img.src : '';
        playerCover.src = coverSrc;
        playerCover.alt = titleEl ? titleEl.textContent : '';
        playerCover.style.display = coverSrc ? '' : 'none';
        playerTitle.textContent = titleEl ? titleEl.textContent : '—';
        playerArtist.textContent = artistEl ? artistEl.textContent : '—';

        if (audioSrc) {
            audio.src = audioSrc;
            audio.load();
        } else {
            audio.removeAttribute('src');
        }

        showFooter();
    }

    function play() {
        if (currentIndex < 0) return;
        if (audio.src) {
            audio.play().catch(function () {});
        }
        isPlaying = true;
        btnPlay.classList.add('player-btn--playing');
        btnPlay.setAttribute('aria-label', 'Pause');
    }

    function pause() {
        audio.pause();
        isPlaying = false;
        btnPlay.classList.remove('player-btn--playing');
        btnPlay.setAttribute('aria-label', 'Play');
    }

    function togglePlay() {
        if (currentIndex < 0) return;
        isPlaying ? pause() : play();
    }

    function playTrack(index) {
        setTrack(index);
        play();
    }

    function prevTrack() {
        var prevIdx = getPrevVisibleIndex();
        if (prevIdx >= 0) {
            setTrack(prevIdx);
            play();
        }
    }

    function nextTrack() {
        var nextIdx = getNextVisibleIndex();
        if (nextIdx >= 0) {
            setTrack(nextIdx);
            play();
        }
    }

    function formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
        var m = Math.floor(seconds / 60);
        var s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    audio.addEventListener('timeupdate', function () {
        var p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        playerProgress.value = p;
        playerTimeCurrent.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', function () {
        playerTimeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('durationchange', function () {
        playerTimeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', function () {
        nextTrack();
    });

    audio.addEventListener('error', function () {
        playerTimeTotal.textContent = '0:00';
    });

    playerProgress.addEventListener('input', function () {
        var dur = audio.duration;
        if (dur) {
            audio.currentTime = (parseFloat(playerProgress.value) / 100) * dur;
        }
    });

    playerVolume.addEventListener('input', function () {
        audio.volume = parseFloat(playerVolume.value) / 100;
    });

    if (audio.volume !== undefined) {
        audio.volume = parseFloat(playerVolume.value) / 100;
    }

    btnPlay.addEventListener('click', togglePlay);
    btnPrev.addEventListener('click', function () {
        if (currentIndex < 0) return;
        prevTrack();
    });
    btnNext.addEventListener('click', function () {
        if (currentIndex < 0) return;
        nextTrack();
    });

    btnShuffle.addEventListener('click', function () {
        this.classList.toggle('player-btn--active');
    });
    btnRepeat.addEventListener('click', function () {
        this.classList.toggle('player-btn--active');
    });

    cards.forEach(function (card, index) {
        card.addEventListener('click', function () {
            playTrack(index);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterCardsBySearch);
        searchInput.addEventListener('keyup', filterCardsBySearch);
    }

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    playerCover.addEventListener('error', function () {
        this.style.display = 'none';
    });
    playerCover.addEventListener('load', function () {
        this.style.display = '';
    });
})();
