// script.js

// 동기들 정보 (이름과 이미지 경로)
// images 폴더에 사진 파일이 있다고 가정합니다. 파일 이름과 확장자를 정확히 맞춰주세요.
const friendsData = [
    { name: "寝てる大谷", image: "/images/sleeping_otani.png" },
    { name: "普通の大谷", image: "/images/otani.png" },
    { name: "先生", image: "/images/suwabe.png" },
    { name: "小枝", image: "/images/koeda.png" },
    { name: "デウン", image: "/images/daeung.png" },
    { name: "可愛さの塊", image: "/images/kawaii.png" }
];

const friendsListElement = document.getElementById('friendsList');
const displayedImageElement = document.getElementById('displayedImage');
const imageContainerElement = document.getElementById('imageContainer');
const currentFriendNameElement = document.getElementById('currentFriendName');
const controlsElement = document.getElementById('controls');

let currentRotation = 0;
let currentScale = 1;
let currentFilter = ''; // 'grayscale(100%)' 또는 ''

// 동기 이름 목록 생성
friendsData.forEach(friend => {
    const listItem = document.createElement('li');
    listItem.textContent = friend.name;
    listItem.dataset.image = friend.image; // 이미지 경로를 data 속성에 저장
    listItem.dataset.name = friend.name;   // 이름도 data 속성에 저장
    listItem.addEventListener('click', () => {
        displayImage(friend.image, friend.name);
    });
    friendsListElement.appendChild(listItem);
});

// 이미지 표시 함수
function displayImage(imagePath, friendName) {
    if (imagePath) {
        displayedImageElement.src = imagePath;
        displayedImageElement.style.display = 'block';
        currentFriendNameElement.textContent = friendName + " 写真";
        controlsElement.style.display = 'block'; // 컨트롤 버튼 보이기
        resetImageTransformations(); // 이미지 변경 시 변환 초기화
    } else {
        displayedImageElement.src = "";
        displayedImageElement.style.display = 'none';
        currentFriendNameElement.textContent = "写真を見る";
        controlsElement.style.display = 'none'; // 컨트롤 버튼 숨기기
    }
}

// 이미지 변환 초기화 함수
function resetImageTransformations() {
    currentRotation = 0;
    currentScale = 1;
    currentFilter = '';
    updateImageTransform();
}

// 이미지 스타일 업데이트 함수
function updateImageTransform() {
    displayedImageElement.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
    displayedImageElement.style.filter = currentFilter;
}

// 확대 함수
window.zoomIn = function() {
    currentScale += 0.1;
    updateImageTransform();
}

// 축소 함수
window.zoomOut = function() {
    if (currentScale > 0.2) { // 너무 작아지지 않도록
        currentScale -= 0.1;
        updateImageTransform();
    }
}

// 회전 함수
window.rotateImage = function() {
    currentRotation += 90;
    updateImageTransform();
}

// 흑백 필터 적용/해제 함수
window.applyFilter = function() {
    if (currentFilter === '') {
        currentFilter = 'grayscale(100%)';
    } else {
        currentFilter = '';
    }
    updateImageTransform();
}

// 초기화 함수
window.resetImage = function() {
    resetImageTransformations();
}

// 초기에는 이미지 숨기기 및 컨트롤 숨기기
displayImage("", "写真を見る");

function updateImageTransform() {
    displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`);
    displayedImageElement.style.setProperty('--current-scale', currentScale);
    displayedImageElement.style.filter = currentFilter;
    // transform 속성은 CSS 변수를 직접 사용하도록 CSS 파일에서 정의하는 것이 더 깔끔할 수 있습니다.
    // 예: #displayedImage { transform: rotate(var(--current-rotation)) scale(var(--current-scale)); }
    // 여기서는 JS에서 직접 설정합니다.
    displayedImageElement.style.transform = `rotate(<span class="math-inline">\{currentRotation\}deg\) scale\(</span>{currentScale})`;
}


// 흔들기 버튼 함수
window.shakeImage = function() {
    if (displayedImageElement.src) {
        // 현재 스케일과 회전값을 CSS 변수로 설정 (펄스 애니메이션에 필요)
        displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale);
        displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`);

        displayedImageElement.classList.add('shake-animation');
        // 애니메이션이 끝난 후 클래스 제거
        setTimeout(() => {
            displayedImageElement.classList.remove('shake-animation');
        }, 500); // 애니메이션 시간(0.5s)과 동일하게 설정
    }
}

// 펄스 버튼 함수
window.pulseImage = function() {
    if (displayedImageElement.src) {
        // 현재 스케일과 회전값을 CSS 변수로 설정
        displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale);
        displayedImageElement.style.setProperty('--current-rotation', `${currentRotation}deg`);

        displayedImageElement.classList.add('pulse-animation');
        setTimeout(() => {
            displayedImageElement.classList.remove('pulse-animation');
        }, 500);
    }
}

// script.js

// ... (이전 friendsData, DOM 요소 선택, displayImage, 기본 효과 함수들) ...

// 이미지 스타일 업데이트 함수 (CSS 변수 사용하도록 수정 또는 확인)
function updateImageTransform() {
    // 애니메이션 중에는 JS로 직접 transform을 계속 덮어쓰면 애니메이션이 끊길 수 있으므로,
    // CSS 변수를 통해 초기 상태나 다른 효과와 연동되도록 합니다.
    // 다만, 회전/확대/축소는 애니메이션과 별개로 직접 제어해야 할 수 있습니다.
    // 여기서는 CSS에서 transform을 CSS 변수로 제어한다고 가정하고,
    // JS에서는 이 변수 값을 바꾸는 역할만 하거나,
    // 애니메이션 클래스가 없을 때만 직접 transform을 설정하도록 합니다.

    // 현재 스케일과 회전값을 CSS 변수로 설정 (펄스, 회전 애니메이션에서 사용)
    displayedImageElement.style.setProperty('--current-scale', currentScale);
    displayedImageElement.style.setProperty('--current-rotation-pulse', `${currentRotation}deg`); // 펄스용 회전
    displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale); // 펄스용 시작 스케일

    // 일반 회전/스케일 적용 (애니메이션 클래스가 없을 때)
    // 또는, 애니메이션은 transform의 특정 부분만 변경하고, 기본 scale/rotation은 JS가 계속 제어
    if (!displayedImageElement.classList.contains('spinning') &&
        !displayedImageElement.classList.contains('pulsing')) {
        displayedImageElement.style.transform = `rotate(${currentRotation}deg) scale(${currentScale})`;
    } else if (displayedImageElement.classList.contains('pulsing')) {
        // 펄싱 중에는 스케일은 CSS 애니메이션이, 회전은 JS 변수가 제어 (CSS 변수 통해)
        // 이미 CSS 변수로 currentRotation을 전달했으므로 추가 조치 필요 없을 수 있음
    } else if (displayedImageElement.classList.contains('spinning')) {
        // 스피닝 중에는 회전은 CSS 애니메이션이, 스케일은 JS 변수가 제어 (CSS 변수 통해)
    }

    displayedImageElement.style.filter = currentFilter;
}


// 기존 확대, 축소, 회전, 필터, 리셋 함수들은 유지하되,
// 애니메이션 상태와 충돌하지 않도록 updateImageTransform을 잘 호출해야 합니다.
// 예를 들어, 회전 버튼은 이제 CSS 애니메이션 'spinning'과 별개로 기본 각도만 조절합니다.
window.rotateImage = function() { // 기본 각도 변경
    currentRotation += 90;
    // CSS 변수를 사용하는 경우, 아래가 없어도 애니메이션에 반영될 수 있음
    displayedImageElement.style.setProperty('--current-rotation-pulse', `${currentRotation}deg`); // 펄스용 회전도 업데이트
    // 만약 spinning 클래스가 있다면, 애니메이션이 우선될 수 있으므로,
    // spinning 상태에서는 이 버튼이 어떻게 동작할지 정의 필요 (예: spinning 멈추고 회전 or 기본 각도만 변경)
    // 여기서는 일단 기본 각도만 변경하고, updateImageTransform()이 적절히 처리한다고 가정
    updateImageTransform();
}


// --- 새로운 지속 효과 토글 함수들 ---

// 빙글빙글 효과 토글
window.toggleSpin = function() {
    if (!displayedImageElement.src) return;
    // 다른 지속 애니메이션은 끈다 (선택 사항)
    displayedImageElement.classList.remove('pulsing');
    displayedImageElement.classList.remove('blinking');

    displayedImageElement.classList.toggle('spinning');
    // 스피닝 시작/중지 시, 현재 스케일 값을 CSS 변수에 다시 설정해줄 필요가 있을 수 있습니다.
    displayedImageElement.style.setProperty('--current-scale', currentScale);
    // updateImageTransform(); // 필요에 따라 호출하여 다른 transform 요소(회전, 스케일) 재적용
}

// 두근두근 효과 토글
window.togglePulse = function() {
    if (!displayedImageElement.src) return;
    displayedImageElement.classList.remove('spinning');
    displayedImageElement.classList.remove('blinking');

    // 펄싱 시작/중지 시, 현재 스케일과 회전값을 CSS 변수에 설정
    displayedImageElement.style.setProperty('--current-scale-pulse-start', currentScale);
    displayedImageElement.style.setProperty('--current-rotation-pulse', `${currentRotation}deg`);

    displayedImageElement.classList.toggle('pulsing');
    // updateImageTransform();
}

// 번쩍번쩍 효과 토글
window.toggleBlink = function() {
    if (!displayedImageElement.src) return;
    displayedImageElement.classList.remove('spinning');
    displayedImageElement.classList.remove('pulsing');

    displayedImageElement.classList.toggle('blinking');
    // updateImageTransform();
}

// 이미지 변경 시 또는 초기화 시 모든 지속 애니메이션 클래스 제거
function resetImageTransformations() {
    currentRotation = 0;
    currentScale = 1;
    currentFilter = '';

    // 모든 애니메이션 클래스 제거
    displayedImageElement.classList.remove('spinning', 'pulsing', 'blinking');
    updateImageTransform();
}
