const quiz_page = document.querySelector("#quiz-page-1")
var first_page = document.querySelector("#first-page")
var second_page = document.querySelector("#second-page-1")
var nav = document.querySelector(".login-nav")
const login = document.querySelector(".login")
const score_page = document.querySelector("#score-page-1")
const score = document.querySelector(".score")
const category = document.querySelector("#category")
const level = document.querySelector("#level")
var selected_cat 
var selected_level 

category.addEventListener("change", () => {
    selected_cat = category.value;
    console.log(selected_cat)
})
level.addEventListener("change", () => {
    selected_level = level.value;
    console.log(selected_level)
})

let cor_select = 0
let incor_select = 0

nav.addEventListener("click", () => {
    first_page.style.display = "none"
    second_page.style.display = "block"
})



quiz = []
var currentQuestionIndex = 0;


function show_ques() {
    console.log('cc ',selected_cat,selected_level)
    
    fetch(`https://opentdb.com/api.php?amount=10&category=${selected_cat}&difficulty=${selected_level}&type=multiple`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            data.results.forEach((item) => {
                quiz.push({
                    questions: item.question,
                    options: number(item.incorrect_answers, item.correct_answer),
                    correctAns: item.correct_answer,
                    category: item.category,
                    difficulty: item.difficulty 
                })
                console.log(quiz)
            })
        })
        .then(() => {
            // console.log(quiz)
            show_quiz()

        })
        .catch((error) => console.log("ERROR: ", error))
}

function show_quiz() {
    quiz_page.innerHTML = `<div id="quiz-page">
                <div id="left-quiz">
                    <div class="ques">
                        <h1>Ques:</h1>
                        <p >${quiz[currentQuestionIndex].questions}</p>
                    </div>
                    <div class="option-1">
                        <div class="options"  data-value="0">
                            <h3>A.</h3>
                            <p >${quiz[currentQuestionIndex].options[0]}</p>
                        </div>
                        <div class="options" data-value="1">
                            <h3>B.</h3>
                            <p >${quiz[currentQuestionIndex].options[1]}</p>
                        </div>
                    </div>
                    <div class="option-1">
                        <div class="options" data-value="2">
                            <h3>C.</h3>
                            <p >${quiz[currentQuestionIndex].options[2]}</p>
                        </div>
                        <div class="options" data-value="3">
                            <h3>D.</h3>
                            <p >${quiz[currentQuestionIndex].options[3]}</p>
                        </div>
                    </div>
                    <div id="next">
                        <div class="back">
                            <i class='bx bx-left-arrow-alt' style='color:#ffffff'></i>
                            <p>BACK</p>
                        </div>
                        <div class="next">
                            <p>NEXT</p>
                            <i class='bx bx-right-arrow-alt' style='color:#ffffff'></i>
                        </div>
                    </div>
                </div>

                <div id="right-quiz">
                    <div class="category">Category: ${quiz[currentQuestionIndex].category}</div>
                    <div class="category">Difficulty: ${quiz[currentQuestionIndex].difficulty}</div>
                    <div class="correct">Correct Choices: ${cor_select}</div>
                    <div class="incorrect">InCorrect Choices: ${incor_select}</div>
                    
                </div>
            </div>`

    var option_elem = document.querySelectorAll('.options ')
    let is_selected = false
    // console.log(option_elem)
    option_elem.forEach((elem) => {
        elem.addEventListener("click", () => {
            if(!is_selected){
                selected_opt = elem.getAttribute("data-value")
                check_ans(selected_opt)
                is_selected = true
                option_elem.forEach((val) => {
                    val.style.pointerEvents = "none";

                    val.style.opacity = 0.7
                })
            }
            // console.log("selected",selected_opt)

        })
    })
    prev_ques()


}

function check_ans(selected_opt) {
    let correctAnswerIndex = 0
    for (let index = 0; index < quiz[currentQuestionIndex].options.length; index++) {
        const element = quiz[currentQuestionIndex].options[index];
        if (element == quiz[currentQuestionIndex].correctAns) {
            correctAnswerIndex = index;
        }
    }
    var color_change = document.querySelector(`div[data-value = "${selected_opt}"]`)
    if (selected_opt == correctAnswerIndex) {
        console.log("Correct")
        cor_select++
        document.querySelector(".correct").textContent = `Correct Choices: ${cor_select}`
        color_change.style.backgroundColor = "green"
        color_change.style.color = "white"
        
    }
    else {
        console.log("Incorrect")
        incor_select++
        document.querySelector(".incorrect").textContent = `InCorrect Choices: ${incor_select}`
        color_change.style.backgroundColor = "red"
        color_change.style.color = "white"

    }

    next_ques()
}

login.addEventListener("click", () => {
    second_page.style.display = "none";
    quiz_page.style.display = "block";

    quiz_page.innerHTML = ''

    show_ques() 

})


function number(arr, elem) {
    let num = parseInt(Math.random() * 3);
    arr.splice(num, 0, elem)
    return arr
}



function next_ques() {
    const next_btn = document.querySelector('.next')
    next_btn.addEventListener('click', () => {
        if (currentQuestionIndex >= 0 && currentQuestionIndex < 9) {
            currentQuestionIndex++
            show_quiz()
            console.log(currentQuestionIndex)
        }
        else {
            let last_score= (cor_select/10)*100;
            console.log("Score ==", last_score,"%")
            score_page.style.display = "block"
            quiz_page.style.display = "none"
            score.textContent = `YOUR SCORE= ${cor_select}/10`
            submit(last_score)
        }
    })
}
function prev_ques() {
    const prev_btn = document.querySelector('.back')
    prev_btn.addEventListener('click', () => {
        if (currentQuestionIndex > 0 && currentQuestionIndex <= 9) {
            currentQuestionIndex--
            show_quiz()
            console.log(currentQuestionIndex)
        }
        else {
            console.log("noott")
        }
    })
}


function submit(elem) {
    let circularProgress = document.querySelector(".circular-progress")
    let ProgressValue = document.querySelector(".progress-value")

    let progressStartValue = 0
    let progressEndValue = elem

    let progress = setInterval(() => {
        progressStartValue++

        ProgressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(rgb(72, 205, 242) ${progressStartValue * 3.6}deg, #ededed 0deg)`;

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }

    }, 10);
}
