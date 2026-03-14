let currentQuestions = [];
let currentIndex = 0;
let score = { correct: 0, wrong: 0 };

function selectSubject(sub) {
    localStorage.setItem('sub', sub);
    localStorage.setItem('mode', document.querySelector('input[name="mode"]:checked').value);
    window.location.href = 'quiz.html';
}

async function initQuiz() {
    const res = await fetch('questions.json');
    const allData = await res.json();
    const sub = localStorage.getItem('sub');
    const mode = localStorage.getItem('mode');

    currentQuestions = sub === 'Random' ? allData : allData.filter(q => q.subject === sub);
    currentQuestions.sort(() => Math.random() - 0.5);
    if(mode === 'timed') currentQuestions = currentQuestions.slice(0, 20);
    
    showQuestion();
}

function showQuestion() {
    if(currentIndex >= currentQuestions.length) {
        alert(`Finished! Score: ${score.correct}/${currentQuestions.length}`);
        window.location.href = 'subjects.html';
        return;
    }
    const q = currentQuestions[currentIndex];
    document.getElementById('q-text').innerText = q.question;
    const optCont = document.getElementById('options');
    optCont.innerHTML = '';
    
    ['A','B','C','D','E'].forEach(l => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.innerText = q[l];
        b.onclick = () => checkAns(l, b);
        optCont.appendChild(b);
    });
    document.getElementById('progress-fill').style.width = (currentIndex / currentQuestions.length * 100) + "%";
}

function checkAns(ans, btn) {
    const q = currentQuestions[currentIndex];
    const btns = document.querySelectorAll('.opt-btn');
    btns.forEach(b => b.disabled = true);
    
    if(ans === q.correct) {
        btn.classList.add('correct');
        score.correct++;
    } else {
        btn.classList.add('wrong');
        score.wrong++;
    }
    
    document.getElementById('explanation').innerText = q.explanation;
    document.getElementById('feedback').classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('feedback').classList.add('hidden');
        currentIndex++;
        showQuestion();
    }, 2000);
}
