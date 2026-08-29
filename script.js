document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        {
            id: 'q1',
            type: 'text',
            label: '1. 반가워요! 이름(또는 닉네임)을 알려주세요.',
            placeholder: '예: 김해방'
        },
        {
            id: 'q2',
            type: 'text',
            label: '2. 연락처를 남겨주세요. (일정 안내용)',
            placeholder: '예: 010-1234-5678'
        },
        {
            id: 'q3',
            type: 'choice',
            label: '3. 현재 당신의 옷장 상태는 어떤가요?',
            options: [
                '🖤 99% 무채색 (블랙, 화이트, 그레이 인간)',
                '🤔 컬러가 있긴 한데, 막상 입으려면 손이 안 가요',
                '🌈 이미 컬러풀하지만, 더 새로운 스타일을 찾고 싶어요'
            ]
        },
        {
            id: 'q4',
            type: 'choice',
            label: '4. 가장 도전해보고 싶은 패션 스타일이나 컬러는?',
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
            label: '5. [무드해방일지]에서 가장 기대하는 활동은 무엇인가요?',
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
            label: '6. 마지막으로 남기고 싶은 말이 있다면 자유롭게 적어주세요. (선택)',
            placeholder: '기대평이나 궁금한 점 등'
        }
    ];

    const appContainer = document.getElementById('app-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const formScreen = document.getElementById('form-screen');
    const completeScreen = document.getElementById('complete-screen');
    const questionContainer = document.querySelector('.question-container');
    const progressBar = document.getElementById('progress-bar');
    
    const startBtn = document.getElementById('start-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentQuestionIndex = 0;
    const answers = {};

    // 1. 폼 시작
    startBtn.addEventListener('click', () => {
        appContainer.classList.add('color-mode'); // 무채색에서 컬러풀하게 전환
        welcomeScreen.classList.remove('active');
        
        setTimeout(() => {
            formScreen.classList.add('active');
            renderQuestion(currentQuestionIndex);
            updateProgressBar();
        }, 500); // 부드러운 전환을 위해 약간의 딜레이
    });

    // 2. 질문 렌더링
    function renderQuestion(index) {
        questionContainer.innerHTML = '';
        const q = questions[index];

        const block = document.createElement('div');
        block.className = 'question-block active';
        
        const label = document.createElement('div');
        label.className = 'question-label';
        label.innerText = q.label;
        block.appendChild(label);

        if (q.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = q.placeholder;
            input.id = `input-${q.id}`;
            if (answers[q.id]) {
                input.value = answers[q.id];
            }
            
            // 엔터키 입력 시 다음으로 이동
            input.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') handleNext();
            });
            
            block.appendChild(input);
            
            // 렌더링 후 포커스
            setTimeout(() => input.focus(), 100);
            
        } else if (q.type === 'choice') {
            const grid = document.createElement('div');
            grid.className = 'options-grid';
            
            q.options.forEach((opt, i) => {
                const card = document.createElement('div');
                card.className = 'option-card';
                card.innerText = opt;
                
                if (answers[q.id] === opt) {
                    card.classList.add('selected');
                }
                
                card.addEventListener('click', () => {
                    // 단일 선택 로직
                    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    answers[q.id] = opt;
                    
                    // 선택 시 자동으로 다음으로 넘어가는 효과 (UX)
                    setTimeout(() => handleNext(), 400);
                });
                
                grid.appendChild(card);
            });
            block.appendChild(grid);
        }

        questionContainer.appendChild(block);
        
        // 버튼 상태 업데이트
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.innerText = index === questions.length - 1 ? '제출하기' : '다음';
    }

    // 3. 네비게이션 처리
    function saveCurrentAnswer() {
        const q = questions[currentQuestionIndex];
        if (q.type === 'text') {
            const input = document.getElementById(`input-${q.id}`);
            if (input) {
                answers[q.id] = input.value.trim();
            }
        }
    }

    function handleNext() {
        saveCurrentAnswer();
        
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            renderQuestion(currentQuestionIndex);
            updateProgressBar();
        } else {
            submitForm();
        }
    }

    function handlePrev() {
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion(currentQuestionIndex);
            updateProgressBar();
        }
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function submitForm() {
        // 실제 폼 전송 로직 (현재는 프론트엔드 모의 처리)
        console.log('제출된 데이터:', answers);
        
        progressBar.style.width = '100%';
        formScreen.classList.remove('active');
        
        setTimeout(() => {
            completeScreen.classList.add('active');
        }, 500);
    }

    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
});
