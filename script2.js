// (تابع لـ script.js)

// عناصر DOM
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackTextElement = document.getElementById('feedback-text');
const submitButton = document.getElementById('submit-button');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreArea = document.getElementById('score-area');

let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null; // لتخزين إجابة المستخدم المختارة

// دالة لتهيئة وعرض السؤال الحالي
function displayQuestion() {
    selectedAnswer = null; // إعادة تعيين الإجابة المختارة عند عرض سؤال جديد
    const currentQuestion = questions[currentQuestionIndex];
    questionTextElement.innerHTML = currentQuestion.text; // استخدام innerHTML للسماح بعرض الرموز المنطقية كـ HTML
    optionsContainer.innerHTML = ''; // مسح الخيارات السابقة
    feedbackTextElement.textContent = '';
    feedbackTextElement.className = ''; // إزالة أي تنسيقات سابقة للتغذية الراجعة
    submitButton.disabled = true; // تعطيل زر التحقق حتى يتم اختيار إجابة

    if (currentQuestion.type === "mcq") {
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `
                <input type="radio" id="option${index}" name="answer" value="${option}">
                <label for="option${index}">${option}</label>
            `;
            optionElement.addEventListener('click', () => {
                // إزالة التحديد السابق إذا وجد
                document.querySelectorAll('#options-container.option input[type="radio"]').forEach(rb => {
                    if (rb.value!== option) rb.checked = false;
                });
                document.getElementById(`option${index}`).checked = true;
                selectedAnswer = option;
                submitButton.disabled = false; // تفعيل زر التحقق عند اختيار إجابة
            });
            optionsContainer.appendChild(optionElement);
        });
    } else if (currentQuestion.type === "tf") {
        const trueFalseOptions = [
            { text: "صح", value: true },
            { text: "خطأ", value: false }
        ];
        trueFalseOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.innerHTML = `
                <input type="radio" id="option${index}" name="answer" value="${option.value}">
                <label for="option${index}">${option.text}</label>
            `;
            optionElement.addEventListener('click', () => {
                 document.querySelectorAll('#options-container.option input[type="radio"]').forEach(rb => {
                    if (String(rb.value)!== String(option.value)) rb.checked = false;
                });
                document.getElementById(`option${index}`).checked = true;
                selectedAnswer = option.value;
                submitButton.disabled = false;
            });
            optionsContainer.appendChild(optionElement);
        });
    }
    submitButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    updateScoreDisplay();
}

// دالة للتحقق من الإجابة وتقديم التغذية الراجعة
function checkAnswer() {
    if (selectedAnswer === null) {
        feedbackTextElement.textContent = 'الرجاء اختيار إجابة أولاً.';
        feedbackTextElement.className = 'incorrect'; // أو أي تنسيق مناسب للتنبيه
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = (String(selectedAnswer) === String(currentQuestion.correctAnswer));

    // تعطيل الخيارات بعد الإجابة
    const optionElements = optionsContainer.querySelectorAll('.option');
    optionElements.forEach(optElement => {
        optElement.classList.add('disabled'); // لمنع المزيد من النقرات
        const input = optElement.querySelector('input');
        if (input) {
            // تلوين الخيار الصحيح
            if (String(input.value) === String(currentQuestion.correctAnswer)) {
                optElement.classList.add('correct-answer');
            }
            // تلوين الخيار الذي اختاره المستخدم إذا كان خاطئاً
            if (input.checked &&!isCorrect) {
                optElement.classList.add('selected-wrong');
            }
        }
    });


    if (isCorrect) {
        score++;
        feedbackTextElement.textContent = 'إجابة صحيحة!';
        feedbackTextElement.className = 'correct';
    } else {
        feedbackTextElement.textContent = `إجابة خاطئة. الإجابة الصحيحة هي: ${getCorrectAnswerText(currentQuestion)}`;
        feedbackTextElement.className = 'incorrect';
    }

    submitButton.style.display = 'none';
    nextButton.style.display = 'inline-block';
    updateScoreDisplay();

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = 'عرض النتيجة النهائية';
    }
}

// دالة مساعدة للحصول على نص الإجابة الصحيحة (خاصة لأسئلة الصح والخطأ)
function getCorrectAnswerText(question) {
    if (question.type === "tf") {
        return question.correctAnswer? "صح" : "خطأ";
    }
    return question.correctAnswer;
}


// دالة للانتقال إلى السؤال التالي أو إنهاء الاختبار
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        displayFinalScore();
    }
}

// دالة لعرض النتيجة النهائية
function displayFinalScore() {
    questionTextElement.textContent = 'اكتمل الاختبار!';
    optionsContainer.innerHTML = '';
    feedbackTextElement.textContent = `نتيجتك النهائية هي: ${score} من ${questions.length}`;
    feedbackTextElement.className = ''; // إزالة أي تنسيق سابق
    submitButton.style.display = 'none';
    nextButton.style.display = 'none';
    scoreArea.style.display = 'block'; // إظهار منطقة النتيجة
}

// دالة لتحديث عرض النقاط
function updateScoreDisplay() {
    scoreElement.textContent = score;
    totalQuestionsElement.textContent = questions.length;
}

// ربط الأحداث بالأزرار
submitButton.addEventListener('click', checkAnswer);
nextButton.addEventListener('click', nextQuestion);

// بدء الاختبار عند تحميل الصفحة
displayQuestion();
scoreArea.style.display = 'block'; // إظهار منطقة النتيجة من البداية لتتبع التقدم