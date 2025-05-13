// script.js

// 동기들 정보 (이름과 이미지 경로)
const friendsData = [
    { name: "可愛さの塊", image: "./images/kawaii.png" },
    { name: "寝てる大谷", image: "./images/sleeping_otani.png" },
    { name: "寝てる小枝", image: "./images/sleepingkoeda.png" },
    { name: "寝てるデウン", image: "./images/sleepingdaeung.png" },
    { name: "寝てるミソン", image: "./images/sleepingmisung.png" },
    { name: "怒ったデヨン", image: "./images/daeyeon.png" },
    { name: "先生", image: "./images/suwabe.png" },
    { name: "普通の大谷", image: "./images/otani.png" },
    { name: "普通の小枝", image: "./images/koeda.png" },
    { name: "普通のデウン", image: "./images/daeung.png" },
    { name: "水なし", image: "./images/mizunashi.png" }
];

// 사용할 댄스 GIF 목록 (images 폴더 안에 실제 파일이 있어야 합니다!)
// 파일 이름과 확장자를 정확히 맞춰주세요!
const danceGifs = {
    banana: "./images/bananacat.gif", // 'banana' 키로 바나나캣 GIF 경로 지정
    happy:  "./images/happycat.gif"    // 'happy' 키로 해피캣 GIF 경로 지정
};

// DOM 요소 선택
const friendsListElement = document.getElementById('friendsList');
const displayedImageElement = document.getElementById('displayedImage');
const imageContainerElement = document.getElementById('imageContainer'); // 댄스 GIF를 위해 필요
const currentFriendNameElement = document.getElementById('currentFriendName');
const controlsElement = document.getElementById('controls');

// 전역 상태 변수 (이전과 동일)
let currentRotation = 0;
let currentScale = 1;
let currentBwFilter = '';
let activeDanceGifElement = null;
let danceTimeoutId = null;

// 이름 목록 생성 (이전과 동일)
if (friendsListElement && displayedImageElement && currentFriendNameElement && controlsElement) {
    friendsData.forEach(friend => {
        const listItem = document.createElement('li');
        listItem.textContent = friend.name;
        listItem.addEventListener('click', () => {
            displayImage(friend.image, friend.name);
        });
        friendsListElement.appendChild(listItem);
    });
} else {
    console.error("필수 HTML 요소(friendsList 등)를 찾을 수 없습니다. ID를 확인해주세요.");
}

// 이미지 스타일 및 CSS 변수 업데이트 함수 (이전과 동일)
function updateImageStyles() {
    if (!displayedImageElement) return;
    displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`);
    displayedImageElement.style.setProperty('--current-scale', currentScale);
    displayedImageElement.style.setProperty('--current-bw-filter', currentBwFilter || 'none');
    if (!displayedImageElement.classList.contains('glitching') &&
        !displayedImageElement.classList.contains('spinning') &&
        !displayedImageElement.classList.contains('pulsing')) {
        displayedImageElement.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
    }
}

// --- 이미지 기본 효과 함수들 ---

window.zoomIn = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    currentScale += 0.1;
    updateImageStyles();
}

window.zoomOut = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    if (currentScale > 0.2) {
        currentScale -= 0.1;
        updateImageStyles();
    }
}

window.rotateImage = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    currentRotation += 90;
    updateImageStyles();
}

window.applyFilter = function() { // 흑백 필터 토글
    if (!displayedImageElement || !displayedImageElement.src) return;
    if (currentBwFilter === '') {
        currentBwFilter = 'grayscale(100%)';
    } else {
        currentBwFilter = '';
    }
    updateImageStyles();
}

// --- "장난" 효과 함수들 ---

window.shakeImage = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale);
    displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`);
    displayedImageElement.classList.add('shake-animation');
    setTimeout(() => {
        if (displayedImageElement) displayedImageElement.classList.remove('shake-animation');
    }, 500);
}

window.applyGlitch = function() {
    if (!displayedImageElement || !displayedImageElement.src || displayedImageElement.classList.contains('glitching')) return;
    
    const ছিলSpinning = displayedImageElement.classList.contains('spinning');
    const ছিলPulsing = displayedImageElement.classList.contains('pulsing');
    if (ছিলSpinning) displayedImageElement.classList.remove('spinning');
    if (ছিলPulsing) displayedImageElement.classList.remove('pulsing');

    displayedImageElement.classList.add('glitching');
    setTimeout(() => {
        if (displayedImageElement) {
            displayedImageElement.classList.remove('glitching');
            if (ছিলSpinning) displayedImageElement.classList.add('spinning');
            else if (ছিলPulsing) displayedImageElement.classList.add('pulsing');
            else updateImageStyles();
        }
    }, 900); // 0.3s * 3회 반복
}

window.toggleSpin = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    displayedImageElement.classList.remove('pulsing', 'blinking', 'glitching');
    displayedImageElement.classList.toggle('spinning');
    displayedImageElement.style.setProperty('--current-scale', currentScale);
    if (!displayedImageElement.classList.contains('spinning')) {
        updateImageStyles();
    }
};

window.togglePulse = function() { // 지속적인 두근거림
    if (!displayedImageElement || !displayedImageElement.src) return;
    displayedImageElement.classList.remove('spinning', 'blinking', 'glitching');
    displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale);
    displayedImageElement.style.setProperty('--current-rotation-pulse', `${currentRotation}deg`);
    displayedImageElement.classList.toggle('pulsing');
    if (!displayedImageElement.classList.contains('pulsing')) {
        updateImageStyles();
    }
};

window.toggleBlink = function() {
    if (!displayedImageElement || !displayedImageElement.src) return;
    displayedImageElement.classList.toggle('blinking');
};

// --- 댄스 타임! 함수들 ---
function clearPreviousDance() {
    if (danceTimeoutId) {
        clearTimeout(danceTimeoutId);
        danceTimeoutId = null;
    }
    if (activeDanceGifElement && activeDanceGifElement.parentNode) {
        activeDanceGifElement.parentNode.removeChild(activeDanceGifElement);
        activeDanceGifElement = null;
    }
}

// 특정 GIF를 보여주는 공통 함수
function showSpecificDanceGif(gifKey) { // 이제 GIF 경로 대신 키를 받음
    if (!displayedImageElement || !displayedImageElement.src || !imageContainerElement) {
        console.warn("댄스 타임: 표시된 사진이 없거나 필요한 요소가 없습니다.");
        return;
    }

    const gifPath = danceGifs[gifKey]; // 키를 사용하여 GIF 경로 가져오기
    if (!gifPath) {
        console.error(`댄스 타임: '${gifKey}'에 해당하는 GIF 경로를 찾을 수 없습니다.`);
        return;
    }

    clearPreviousDance();

    activeDanceGifElement = document.createElement('img');
    activeDanceGifElement.src = gifPath;
    activeDanceGifElement.alt = `${gifKey} dancing GIF`;
    activeDanceGifElement.classList.add('dance-gif-overlay');

    const mainImageRect = displayedImageElement.getBoundingClientRect();
    const gifScaleRatio = Math.random() * 0.2 + 0.5; // 50% ~ 70% 크기 (좀 더 크게)
    
    activeDanceGifElement.style.width = `${mainImageRect.width * gifScaleRatio}px`;
    activeDanceGifElement.style.height = 'auto';

    // GIF 위치: 사진 중앙 하단에 더 가깝게
    activeDanceGifElement.style.bottom = `0%`; // 사진의 맨 아래에 붙도록 시도
    activeDanceGifElement.style.left = '50%';
    activeDanceGifElement.style.transform = 'translateX(-50%) translateY(0%)'; // 하단 중앙 정렬 (translateY도 필요할 수 있음)
                                                                              // 또는 bottom과 left만으로 위치 조정

    // GIF가 이미지 컨테이너의 실제 보이는 영역을 기준으로 위치하도록 수정
    // displayedImageElement의 실제 offsetTop, offsetLeft를 imageContainer 기준으로 계산
    const imgStyle = window.getComputedStyle(displayedImageElement);
    const imgMarginTop = parseFloat(imgStyle.marginTop);
    const imgMarginLeft = parseFloat(imgStyle.marginLeft);

    // 이미지 컨테이너 내에서 displayedImage의 실제 시작 위치
    // (displayedImage가 flex 아이템으로 중앙 정렬되므로, 이 계산이 복잡할 수 있음)
    // 여기서는 displayedImageElement의 크기를 기준으로 bottom, left를 설정했으므로,
    // activeDanceGifElement를 imageContainerElement가 아닌 displayedImageElement의 부모에 추가하거나,
    // displayedImageElement 자체에 position:relative를 주고 그 안에 넣는 방법도 고려.
    // 현재는 imageContainerElement에 추가하고 있으므로, 위치를 imageContainer 기준으로 다시 계산.

    // 간단하게는, imageContainer의 중앙 하단에 위치시키도록 수정:
    const containerHeight = imageContainerElement.offsetHeight;
    const gifHeight = mainImageRect.height * gifScaleRatio; // 예상 GIF 높이

    activeDanceGifElement.style.bottom = `5px`; // 컨테이너 하단에서 5px 위
    activeDanceGifElement.style.left = '50%';
    activeDanceGifElement.style.transform = 'translateX(-50%)';


    if(imageContainerElement) { // imageContainerElement가 존재하는지 확인
        imageContainerElement.appendChild(activeDanceGifElement);
    } else {
        console.error("imageContainerElement를 찾을 수 없습니다.");
        return;
    }


    const gifDuration = 3000 + (Math.random() * 2000);
    danceTimeoutId = setTimeout(clearPreviousDance, gifDuration);
}

// "바나나캣 댄스" 버튼 함수
window.bananaCatDance = function() {
    showSpecificDanceGif('banana'); // danceGifs 객체의 'banana' 키 사용
}

// "해피캣 댄스" 버튼 함수
window.happyCatDance = function() {
    showSpecificDanceGif('happy'); // danceGifs 객체의 'happy' 키 사용
}

// --- 초기화 및 메인 로직 함수 ---
window.resetImage = function() {
    if (!displayedImageElement) return;
    currentRotation = 0;
    currentScale = 1;
    currentBwFilter = '';

    displayedImageElement.classList.remove('spinning', 'pulsing', 'blinking', 'glitching', 'shake-animation', 'pulse-animation');
    clearPreviousDance();

    displayedImageElement.style.setProperty('--current-rotation', '0deg');
    displayedImageElement.style.setProperty('--current-scale', '1');
    displayedImageElement.style.setProperty('--current-bw-filter', 'none');
    
    displayedImageElement.style.transform = `rotate(0deg) scale(1)`;
    displayedImageElement.style.filter = 'none';
}

function displayImage(imagePath, friendName) {
    // 이 함수들은 이미 이전 답변에서 DOM 요소 null 체크가 추가된 버전으로 가정합니다.
    // const localDisplayedImageElement = ... 등
    // 여기서는 전역 변수를 사용한다고 가정합니다.
    if (!displayedImageElement || !currentFriendNameElement || !controlsElement) {
        console.error("displayImage: 필수 HTML 요소를 찾을 수 없습니다.");
        return;
    }
    
    clearPreviousDance();

    if (imagePath) {
        displayedImageElement.src = imagePath;
        displayedImageElement.style.display = 'block'; // 이미지를 보이게 함
        currentFriendNameElement.textContent = friendName + "の写真";
        controlsElement.style.display = 'flex'; // 컨트롤 버튼들을 flex로 보이게 함 (CSS에서 flex 설정)
        resetImage();
    } else {
        displayedImageElement.src = "";
        displayedImageElement.style.display = 'none';
        currentFriendNameElement.textContent = "写真を見る";
        controlsElement.style.display = 'none';
    }
}

// 모든 확대/축소 등 기본 효과 함수들 (생략 없이 다 넣어주세요)
window.zoomIn = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; currentScale += 0.1; updateImageStyles(); }
window.zoomOut = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; if (currentScale > 0.2) { currentScale -= 0.1; updateImageStyles(); } }
window.rotateImage = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; currentRotation += 90; updateImageStyles(); }
window.applyFilter = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; if (currentBwFilter === '') { currentBwFilter = 'grayscale(100%)'; } else { currentBwFilter = ''; } updateImageStyles(); }
window.shakeImage = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale); displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`); displayedImageElement.classList.add('shake-animation'); setTimeout(() => { if (displayedImageElement) displayedImageElement.classList.remove('shake-animation'); }, 500); }
window.applyGlitch = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src || displayedImageElement.classList.contains('glitching')) return; const prevClasses = ['spinning', 'pulsing'].filter(c => displayedImageElement.classList.contains(c)); prevClasses.forEach(c => displayedImageElement.classList.remove(c)); displayedImageElement.classList.add('glitching'); setTimeout(() => { if (displayedImageElement) { displayedImageElement.classList.remove('glitching'); prevClasses.forEach(c => displayedImageElement.classList.add(c)); if (prevClasses.length === 0) updateImageStyles(); } }, 900); }
window.toggleSpin = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; ['pulsing', 'blinking', 'glitching'].forEach(c => displayedImageElement.classList.remove(c)); displayedImageElement.classList.toggle('spinning'); displayedImageElement.style.setProperty('--current-scale', currentScale); if (!displayedImageElement.classList.contains('spinning')) updateImageStyles(); };
window.togglePulse = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; ['spinning', 'blinking', 'glitching'].forEach(c => displayedImageElement.classList.remove(c)); displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale); displayedImageElement.style.setProperty('--current-rotation-pulse', `${currentRotation}deg`); displayedImageElement.classList.toggle('pulsing'); if (!displayedImageElement.classList.contains('pulsing')) updateImageStyles(); };
window.toggleBlink = function() { /* 이전 코드 참고 */ if (!displayedImageElement || !displayedImageElement.src) return; displayedImageElement.classList.toggle('blinking'); };


// 초기 페이지 로드 시 실행
displayImage("", "写真を見る");
