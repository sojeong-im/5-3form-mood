import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXR0Z0nh2_81JRNOKP6HwElHIUgciK1wA",
  authDomain: "beu-209eb.firebaseapp.com",
  projectId: "beu-209eb",
  storageBucket: "beu-209eb.firebasestorage.app",
  messagingSenderId: "953956944176",
  appId: "1:953956944176:web:7cbe6fcabbc8963b47e0f5",
  measurementId: "G-537REF04BD"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        { id: 'q1', type: 'text', label: '1. 이름을 알려주세요!', placeholder: '단답형' },
        { id: 'q2', type: 'text', label: '2. 나이 / 성별을 알려주세요.', placeholder: '예) 24 / 남' },
        { id: 'q3', type: 'text', label: '3. 현재 하고 있는 일을 알려주세요.', placeholder: '예) 대학생 / 직장인 / 취준생 등' },
        { id: 'q4', type: 'text', label: '4. 주로 활동하기 편한 지하철역을 알려주세요 🚇', placeholder: '예) 건대입구역, 신촌역' },
        { id: 'q5', type: 'checkbox', label: '5. 평소 본인의 옷 스타일과 가장 가까운 것은 무엇인가요? 👕\n(복수 선택 가능)', options: ['무채색·미니멀', '캐주얼', '스트릿', '빈티지', '페미닌', '댄디', '스포티', '그때그때 달라요', '아직 내 스타일을 찾는 중!'] },
        { id: 'q6', type: 'textarea', label: '6. 요즘 한 번쯤 도전해보고 싶은 스타일이 있나요? 🎨', placeholder: '예) 포인트 컬러 넣어보기 / 빈티지 도전 / 액세서리 활용 / 평소 안 입던 핏 등\n아직 없다면 편하게 없음이라고 적어주셔도 됩니다 :)' },
        { id: 'q7', type: 'checkbox', label: '7. 무드해방일지에서 가장 해보고 싶은 활동을 골라주세요! 🛍️\n(복수 선택 가능)', options: ['성수·홍대 등 쇼룸 투어', '팝업스토어 탐방', '빈티지숍·동묘 탐방', '서로의 내돈내산 패션 꿀템 공유', '새로운 스타일 같이 도전하기', '데일리룩 사진 남기기', '쇼핑 번개', '플리마켓·벼룩시장 가기', '기타'] },
        { id: 'q8', type: 'checkbox', label: '8. 옷을 고를 때 가장 중요하게 생각하는 건 무엇인가요? 👀\n(복수 선택 가능)', options: ['편안함', '나한테 잘 어울리는지', '색감', '핏·실루엣', '개성', '유행·트렌드', '가격', '그냥 마음에 들면 산다 😎'] },
        { id: 'q9', type: 'textarea', label: '9. 사고 싶거나 입어보고 싶지만 아직 도전하지 못한 아이템이나 스타일이 있나요?', placeholder: '예) 빨간색 포인트 아이템 / 빈티지 자켓 / 액세서리 레이어드 / 평소와 완전히 다른 스타일 등' },
        { id: 'q10', type: 'checkbox', label: '10. 무드해방일지에서 어떤 시간을 보내고 싶나요? 🤍\n(복수 선택 가능)', options: ['나만의 스타일 찾아보기', '새로운 스타일에 도전해보기', '패션 정보·꿀팁 공유하기', '예쁜 사진과 기록 남기기', '새로운 사람들과 친해지기', '서울의 새로운 공간 돌아다니기', '부담 없이 같이 쇼핑하기', '그냥 재미있게 놀기!'] },
        { id: 'q11', type: 'grid', label: '11. 정기 모임에 참여 가능한 요일과 시간대를 모두 체크해주세요! 🗓️', rows: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'], cols: ['10~13시', '13~16시', '16~19시', '19시 이후'] },
        { id: 'q12', type: 'textarea', label: '12. 마지막으로, 무드해방일지에 지원하게 된 이유를 편하게 들려주세요! 💬', placeholder: '패션을 얼마나 잘 아는지는 중요하지 않아요 :)\n지원하게 된 계기나 해보고 싶은 것, 기대하는 점 등을 자유롭게 적어주세요.' },
        { id: 'q13', type: 'agreement', label: '지원 전 확인해주세요 ✓', options: ['월 1~2회 서울 및 서울 근교에서 활동하는 모임임을 확인했습니다.', '일정과 장소는 멤버들의 가능 시간을 고려해 조율되는 점을 확인했습니다.', '정치·종교·시민단체 활동, 다단계 및 포교 등 다른 목적의 참여는 제한되는 점을 확인했습니다.'] }
    ];

    const appContainer = document.getElementById('app-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const formScreen = document.getElementById('form-screen');
    const completeScreen = document.getElementById('complete-screen');
    const questionContainer = document.querySelector('.question-container');
    
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentQuestionIndex = 0;
    const answers = {};

    function initQuestions() {
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = `question-card scrapbook-card ${index === 0 ? 'active' : ''}`;
            card.dataset.index = index;
            
            const tape = document.createElement('div');
            tape.className = 'card-tape';
            card.appendChild(tape);

            const label = document.createElement('div');
            label.className = 'q-label handwriting';
            label.innerText = q.label;
            card.appendChild(label);

            if (q.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = q.placeholder;
                input.id = `input-${q.id}`;
                input.addEventListener('keypress', (e) => {
                    if(e.key === 'Enter') handleNext();
                });
                card.appendChild(input);
            } else if (q.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.placeholder = q.placeholder;
                textarea.id = `input-${q.id}`;
                textarea.className = 'custom-textarea';
                card.appendChild(textarea);
            } else if (q.type === 'checkbox' || q.type === 'agreement') {
                const list = document.createElement('div');
                list.className = 'choice-list';
                
                q.options.forEach((opt, optIndex) => {
                    const item = document.createElement('label');
                    item.className = 'choice-item checkbox-item';
                    
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.value = opt;
                    cb.name = q.id;
                    cb.id = `${q.id}-opt${optIndex}`;
                    
                    const span = document.createElement('span');
                    span.innerText = opt;
                    
                    item.appendChild(cb);
                    item.appendChild(span);
                    list.appendChild(item);
                });
                card.appendChild(list);
            } else if (q.type === 'grid') {
                const gridContainer = document.createElement('div');
                gridContainer.className = 'grid-container';
                
                const table = document.createElement('table');
                table.className = 'grid-table';
                
                const thead = document.createElement('thead');
                const trHead = document.createElement('tr');
                trHead.appendChild(document.createElement('th')); 
                q.cols.forEach(col => {
                    const th = document.createElement('th');
                    th.innerText = col;
                    trHead.appendChild(th);
                });
                thead.appendChild(trHead);
                table.appendChild(thead);
                
                const tbody = document.createElement('tbody');
                q.rows.forEach((row, rIdx) => {
                    const tr = document.createElement('tr');
                    const tdRowLabel = document.createElement('td');
                    tdRowLabel.innerText = row;
                    tr.appendChild(tdRowLabel);
                    
                    q.cols.forEach((col, cIdx) => {
                        const td = document.createElement('td');
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.name = `${q.id}-${rIdx}`;
                        cb.value = col;
                        cb.dataset.row = row;
                        cb.dataset.col = col;
                        td.appendChild(cb);
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);
                gridContainer.appendChild(table);
                card.appendChild(gridContainer);
            }

            questionContainer.appendChild(card);
        });
    }

    initQuestions();

    startBtn.addEventListener('click', () => {
        appContainer.classList.remove('monochrome-mode');
        appContainer.classList.add('color-mode'); 
        welcomeScreen.classList.remove('active');
        setTimeout(() => {
            formScreen.classList.add('active');
            updateUI();
        }, 500); 
    });

    function saveCurrentAnswer() {
        const q = questions[currentQuestionIndex];
        if (q.type === 'text' || q.type === 'textarea') {
            const input = document.getElementById(`input-${q.id}`);
            if (input) answers[q.id] = input.value.trim();
        } else if (q.type === 'checkbox' || q.type === 'agreement') {
            const checkboxes = document.querySelectorAll(`input[name="${q.id}"]:checked`);
            answers[q.id] = Array.from(checkboxes).map(cb => cb.value);
        } else if (q.type === 'grid') {
            const checkedBoxes = document.querySelectorAll(`input[name^="${q.id}-"]:checked`);
            const gridData = {};
            checkedBoxes.forEach(cb => {
                if (!gridData[cb.dataset.row]) gridData[cb.dataset.row] = [];
                gridData[cb.dataset.row].push(cb.dataset.col);
            });
            answers[q.id] = gridData;
        }
    }

    function validateCurrentStep() {
        const q = questions[currentQuestionIndex];
        if (q.type === 'agreement') {
            const checkboxes = document.querySelectorAll(`input[name="${q.id}"]`);
            const checked = document.querySelectorAll(`input[name="${q.id}"]:checked`);
            if (checkboxes.length !== checked.length) {
                alert('모든 필수 항목을 확인해주세요!');
                return false;
            }
        }
        return true;
    }

    function updateUI() {
        const cards = document.querySelectorAll('.question-card');
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'prev');
            if (idx === currentQuestionIndex) {
                card.classList.add('active');
                const input = card.querySelector('input[type="text"], textarea');
                if (input) setTimeout(() => input.focus(), 300);
            } else if (idx < currentQuestionIndex) {
                card.classList.add('prev');
            }
        });

        const progressContainer = document.querySelector('.progress-text');
        if (progressContainer) {
            progressContainer.innerHTML = `<span class="handwriting" style="font-size:2.5rem;">${currentQuestionIndex + 1}</span> / ${questions.length}`;
        }

        prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? '제출할게요! ✉️' : '다음 장';
    }

    function handleNext() {
        saveCurrentAnswer();
        if (!validateCurrentStep()) return;
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            updateUI();
        } else {
            submitForm();
        }
    }

    function handlePrev() {
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateUI();
        }
    }

    async function submitForm() {
        console.log('제출된 데이터:', answers);
        try {
            nextBtn.innerText = '제출 중...';
            nextBtn.disabled = true;
            
            await addDoc(collection(db, "applications"), {
                ...answers,
                timestamp: new Date()
            });
            
            formScreen.classList.remove('active');
            setTimeout(() => {
                completeScreen.classList.add('active');
            }, 500);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
            nextBtn.innerText = '제출할게요! ✉️';
            nextBtn.disabled = false;
        }
    }

    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
});
