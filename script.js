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
    console.log(hours);

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