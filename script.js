function openFeatures() {
    var allElems = document.querySelectorAll('.elem')
    var fullElemPage = document.querySelectorAll('.fullElem')
    var fullElemPageBackBtn = document.querySelectorAll('.fullElem .esc')

    allElems.forEach(function (elem) {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })

    fullElemPageBackBtn.forEach(function (back) {
        back.addEventListener('click', function () {
            const parent = back.closest('.fullElem');
            if (parent) {
                parent.style.display = 'none';
            }
        })
    })
}
openFeatures()

function todolist() {
    var form = document.querySelector('.addTasks form')
    var taskInput = document.querySelector('.addTasks form input')
    var taskDetailsInput = document.querySelector('.addTasks form textarea')
    var taskCheckBox = document.querySelector('.addTasks form #importantCheckbox')

    var currentTask = []
    if (localStorage.getItem('currentTask')) {
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
    }
    else {
        console.log('Task list is empty');
    }

    function renderTasks() {
        localStorage.setItem('currentTask', JSON.stringify(currentTask))
        var allTask = document.querySelector('.allTasks')
        var sum = ''
        currentTask.forEach(function (elem, idx) {
            sum += `<div class="tasks">
                <h5>${elem.task}<span class="${elem.imp}">Imp</span></h5>
                <details>
                    <summary>More Info</summary>
                    <p>${elem.details}</p>
                </details>
                <button id=${idx}>Mark as Completed</button>
            </div>`
        })
        allTask.innerHTML = sum;
        const allDetails = document.querySelectorAll('.tasks details')
        allDetails.forEach(function (detail) {
            detail.addEventListener('toggle', function () {
                const summary = detail.querySelector('summary')
                if (detail.open) {
                    summary.style.display = 'none'
                } else {
                    summary.style.display = 'block'
                }
            })
        })
        var markCompleteBtn = document.querySelectorAll('.tasks button')
        markCompleteBtn.forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTasks()
            })
        })
    }
    renderTasks()

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        currentTask.push(
            {
                task: taskInput.value,
                details: taskDetailsInput.value,
                imp: taskCheckBox.checked
            }
        )
        renderTasks()

        taskInput.value = ''
        taskDetailsInput.value = ''
        taskCheckBox.checked = ''
    })
}
todolist()

function dailyPlanner() {
    var dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}

    var dayPlanner = document.querySelector('.day-planner')

    var hours = Array.from({ length: 18 }, (elem, idx) => `${6 + idx}:00 - ${7 + idx}:00`)

    var wholeDaySum = ''
    hours.forEach(function (elem, idx) {
        var savedData = dayPlanData[idx] || ''
        wholeDaySum += `<div class="day-planner-time">
                        <p>${elem}</p>
                        <input id=${idx} type="text" value="${savedData}" placeholder="Enter Task...">
                    </div>`
    })

    dayPlanner.innerHTML = wholeDaySum

    var dayPlannerInput = document.querySelectorAll('.day-planner input')

    dayPlannerInput.forEach(function (elem) {
        elem.addEventListener('input', function () {
            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}
dailyPlanner()

function motivationalQuote() {
    var motivationQuote = document.querySelector('.motivation-2 h1')
    var motivationAuthor = document.querySelector('.motivation-3 h2')

    async function fetchQuote() {
        let response = await fetch('https://api.quotable.io/random')
        let data = await response.json()

        motivationQuote.innerHTML = data.content;
        motivationAuthor.innerHTML = '~' + " " + data.author;
    }
    fetchQuote()
}
motivationalQuote()

function pomodoroTimer() {
    let timerInterval = null;
    let totalSeconds = 25 * 60;
    let timer = document.querySelector('.focus-timer h2');
    let startBtn = document.querySelector('.focus-timer .start');
    let pauseBtn = document.querySelector('.focus-timer .pause');
    let resetBtn = document.querySelector('.focus-timer .reset');
    let session = document.querySelector('.pomodoro-fullpage .session');
    let isWorkSession = true;

    function updateTimer() {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        timer.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    function startTimer() {
        clearInterval(timerInterval)

        if (isWorkSession) {


            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = false
                    clearInterval(timerInterval)
                    timer.innerHTML = '05:00'
                    session.innerHTML = 'Take a Break'
                    session.style.backgroundColor = 'var(--tri)'
                    totalSeconds = 5 * 60
                }
            }, 1000)
        } else {
            timerInterval = setInterval(function () {
                if (totalSeconds > 0) {
                    totalSeconds--
                    updateTimer()
                } else {
                    isWorkSession = true
                    clearInterval(timerInterval)
                    timer.innerHTML = '25:00'
                    session.innerHTML = 'Work Session'
                    session.style.backgroundColor = 'var(--green)'
                    totalSeconds = 25 * 60
                }
            }, 1000)
        }
    }

    function pauseTimer() {
        clearInterval(timerInterval)
    }

    function resetTimer() {
        clearInterval(timerInterval)
        totalSeconds = 25 * 60
        updateTimer()
        timer.innerHTML = '25:00'
        session.innerHTML = 'Work Session'
        session.style.backgroundColor = 'var(--green)'
        startBtn.addEventListener('click', startTimer)
        pauseBtn.addEventListener('click', pauseTimer)
        resetBtn.addEventListener('click', resetTimer)
    }

    startBtn.addEventListener('click', startTimer)
    pauseBtn.addEventListener('click', pauseTimer)
    resetBtn.addEventListener('click', resetTimer)
}
pomodoroTimer()

const achievementsPanel = document.getElementById('achievementsPanel');
const escButton = document.getElementById('escButton');

function openAchievements() {
    achievementsPanel.style.display = 'block';
    var escBtn = document.querySelector('.esc')
    escBtn.addEventListener('click', () => {
        achievementsPanel.style.display = 'none';
    });

    document.addEventListener("DOMContentLoaded", () => {
        const addGoalBtn = document.getElementById("add-goal-btn");
        const goalInput = document.getElementById("goal-input");
        const goalList = document.getElementById("goal-list");

        addGoalBtn.addEventListener("click", () => {
            const goalText = goalInput.value.trim();

            if (goalText !== "") {
                const goalItem = document.createElement("li");
                goalItem.className = "goal-item";

                const goalContent = document.createElement("span");
                goalContent.textContent = goalText;

                const goalActions = document.createElement("div");
                goalActions.className = "goal-actions";

                const completeBtn = document.createElement("button");
                completeBtn.innerHTML = "✅";
                completeBtn.title = "Mark as Complete";

                const deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "🗑️";
                deleteBtn.title = "Delete Goal";

                completeBtn.addEventListener("click", () => {
                    goalItem.classList.toggle("completed");
                });

                deleteBtn.addEventListener("click", () => {
                    goalList.removeChild(goalItem);
                });

                goalActions.appendChild(completeBtn);
                goalActions.appendChild(deleteBtn);

                goalItem.appendChild(goalContent);
                goalItem.appendChild(goalActions);

                goalList.appendChild(goalItem);
                goalInput.value = "";
            }
        });

        goalInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                addGoalBtn.click();
            }
        });
    });

}
openAchievements()

async function weatherAPICall() {
    let response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.25&longitude=77.50&hourly=temperature_2m')
    let data = await response.json();
    console.log(data);

}
weatherAPICall()