document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            id: 'q1',
            type: 'text',
            label: '반가워요! 📝\n이름(또는 닉네임)을 알려주세요.',
            placeholder: '예: 김해방'
        },
        {
            id: 'q2',
            type: 'text',
            label: '연락드릴 수 있는 번호를 남겨주세요 📱',
            placeholder: '예: 010-1234-5678'
        },
        {
            id: 'q3',
            type: 'choice',
            label: '현재 당신의 옷장 상태는 어떤가요? 👗',
            options: [
                '🖤 99% 무채색 (블랙, 화이트, 그레이 인간)',
                '🤔 컬러가 있긴 한데, 막상 입으려면 손이 안 가요',
                '🌈 이미 컬러풀하지만, 더 새로운 스타일을 찾고 싶어요'
            ]
        },
        {
            id: 'q4',
            type: 'choice',
            label: '가장 도전해보고 싶은 패션이나 컬러는? 🎨',
            options: [
                '비비드하고 쨍한 원색 컬러',
                '부드럽고 은은한 파스텔 톤',
                '남들과 다른 유니크한 패턴이나 소재',
                '포인트가 되는 액세서리 (모자, 안경, 가방 등)'
            ]
        },
        {
            id: 'q5',
            type: 'choice',
            label: '[무드해방일지]에서 가장 기대하는 활동은? ✨',
            options: [
                '컬러 해방템 및 데일리룩 꿀템 공유',
                '나만의 스타일을 기록하고 이야기 나누기',
                '핫플레이스(홍대/성수) 쇼룸 및 팝업 탐방',
                '비슷한 취향을 가진 사람들과의 네트워킹'
            ]
        },
        {
            id: 'q6',
            type: 'text',
            label: '마지막으로 남기고 싶은 말이 있다면 적어주세요 :)',
            placeholder: '기대평이나 궁금한 점 등 자유롭게!'
        }
    ];

    const appContainer = document.getElementById('app-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const formScreen = document.getElementById('form-screen');
    const completeScreen = document.getElementById('complete-screen');
    const questionContainer = document.querySelector('.question-container');
    const currentStepText = document.getElementById('current-step');
    
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentQuestionIndex = 0;
    const answers = {};

    // 1. 초기 렌더링 (모든 질문 카드를 미리 만들어둠)
    function initQuestions() {
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = `question-card scrapbook-card ${index === 0 ? 'active' : ''}`;
            card.dataset.index = index;
            
            // 상단 테이프
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
            } else if (q.type === 'choice') {
                const list = document.createElement('div');
                list.className = 'choice-list';
                
                q.options.forEach((opt) => {
                    const item = document.createElement('div');
                    item.className = 'choice-item';
                    item.innerText = opt;
                    
                    item.addEventListener('click', () => {
                        // 다른 선택 해제
                        const siblings = list.querySelectorAll('.choice-item');
                        siblings.forEach(s => s.classList.remove('selected'));
                        item.classList.add('selected');
                        answers[q.id] = opt;
                        
                        setTimeout(() => handleNext(), 300);
                    });
                    
                    list.appendChild(item);
                });
                card.appendChild(list);
            }

            questionContainer.appendChild(card);
        });
    }

    initQuestions();

    // 2. 폼 시작
    startBtn.addEventListener('click', () => {
        appContainer.classList.remove('monochrome-mode');
        appContainer.classList.add('color-mode'); 
        
        welcomeScreen.classList.remove('active');
        
        setTimeout(() => {
            formScreen.classList.add('active');
            updateUI();
        }, 500); 
    });

    // 3. 네비게이션 및 카드 전환 로직
    function saveCurrentAnswer() {
        const q = questions[currentQuestionIndex];
        if (q.type === 'text') {
            const input = document.getElementById(`input-${q.id}`);
            if (input) {
                answers[q.id] = input.value.trim();
            }
        }
    }

    function updateUI() {
        // 카드 상태 업데이트 (슬라이드 애니메이션)
        const cards = document.querySelectorAll('.question-card');
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'prev');
            if (idx === currentQuestionIndex) {
                card.classList.add('active');
                
                // 텍스트 인풋이면 포커스
                const input = card.querySelector('input');
                if (input) setTimeout(() => input.focus(), 300);
                
            } else if (idx < currentQuestionIndex) {
                card.classList.add('prev');
            }
        });

        // 텍스트 업데이트
        currentStepText.innerText = currentQuestionIndex + 1;
        
        // 버튼 상태
        prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? '제출할게요! ✉️' : '다음 장';
    }

    function handleNext() {
        saveCurrentAnswer();
        
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

    function submitForm() {
        console.log('제출된 데이터:', answers);
        formScreen.classList.remove('active');
        setTimeout(() => {
            completeScreen.classList.add('active');
        }, 500);
    }

    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
});
