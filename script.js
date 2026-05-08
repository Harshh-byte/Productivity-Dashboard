document.addEventListener("DOMContentLoaded", () => {
  const App = {
    state: {
      activePage: localStorage.getItem("dash_active_page") || "dashboard",
      accentColor: localStorage.getItem("dash_accent_color") || "#6366f1",
      isDarkMode: localStorage.getItem("dash_dark_mode") === "true",
      tasks: JSON.parse(localStorage.getItem("dash_tasks")) || [],
      planner: JSON.parse(localStorage.getItem("dash_planner")) || {},
      goals: JSON.parse(localStorage.getItem("dash_goals")) || [],
      weather: null,
    },

    init() {
      this.cacheDOM();
      this.bindEvents();
      this.applyTheme();
      this.render();
      this.setupWeather();
      this.setupQuotes();
      this.setupFocusTimer();
      this.updateDate();
    },

    cacheDOM() {
      this.dom = {
        body: document.body,
        navLinks: document.querySelectorAll(".nav-link"),
        pages: document.querySelectorAll(".page"),
        pageTitle: document.getElementById("page-title"),
        colorBtns: document.querySelectorAll(".color-btn"),
        themeToggle: document.getElementById("theme-toggle"),
        currentDate: document.getElementById("current-date"),
        currentYear: document.getElementById("current-year"),
        greeting: document.getElementById("greeting"),
        userName: document.getElementById("user-name"),

        todoForm: document.getElementById("todoForm"),
        taskInput: document.getElementById("taskInput"),
        taskDesc: document.getElementById("taskDesc"),
        importantCheckbox: document.getElementById("importantCheckbox"),
        allTasks: document.getElementById("allTasks"),
        filterBtns: document.querySelectorAll(".filter-btn"),
        miniTasks: document.getElementById("mini-task-container"),

        plannerList: document.getElementById("day-planner-list"),

        timerDisplay: document.getElementById("timerDisplay"),
        miniTimer: document.getElementById("mini-timer"),
        miniTimerLabel: document.getElementById("mini-timer-label"),
        sessionBadge: document.getElementById("sessionBadge"),
        startBtn: document.getElementById("startBtn"),
        pauseBtn: document.getElementById("pauseBtn"),
        resetBtn: document.getElementById("resetBtn"),
        miniTimerBtn: document.getElementById("mini-timer-btn"),

        weatherSearch: document.getElementById("weather-search"),
        weatherLocation: document.getElementById("weather-location"),
        weatherTemp: document.getElementById("weather-temp"),
        weatherCond: document.getElementById("weather-condition"),
        weatherIcon: document.getElementById("weather-main-icon"),
        weatherWind: document.getElementById("weather-wind"),
        weatherHum: document.getElementById("weather-humidity"),
        forecastGrid: document.getElementById("forecast-grid"),
        miniWeatherTemp: document.getElementById("mini-weather-temp"),
        miniWeatherDesc: document.getElementById("mini-weather-desc"),
        miniWeatherIcon: document.getElementById("mini-weather-icon"),
        miniWeatherLoc: document.getElementById("mini-weather-loc"),

        goalInput: document.getElementById("goal-input"),
        addGoalBtn: document.getElementById("add-goal-btn"),
        goalList: document.getElementById("goal-list"),

        fullQuote: document.getElementById("full-quote-text"),
        fullAuthor: document.getElementById("full-quote-author"),
        miniQuote: document.getElementById("mini-quote"),
        miniAuthor: document.getElementById("mini-quote-author"),
        refreshQuote: document.getElementById("refresh-quote"),
        copyQuoteBtn: document.getElementById("copy-quote"),
        quoteContentWrapper: document.getElementById("quote-content-wrapper"),
      };
    },

    bindEvents() {
      this.dom.navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          this.switchPage(link.dataset.page);
        });
      });

      this.dom.colorBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.state.accentColor = btn.dataset.color;
          this.applyTheme();
          localStorage.setItem("dash_accent_color", this.state.accentColor);
        });
      });

      this.dom.themeToggle.addEventListener("click", () => {
        this.state.isDarkMode = !this.state.isDarkMode;
        this.applyTheme();
        localStorage.setItem("dash_dark_mode", this.state.isDarkMode);
      });

      this.dom.todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTask();
      });

      this.dom.filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.dom.filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.renderTasks(btn.dataset.filter);
        });
      });

      this.dom.addGoalBtn.addEventListener("click", () => this.addGoal());
      this.dom.goalInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.addGoal();
      });

      this.dom.weatherSearch.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.updateWeather(e.target.value);
      });

      this.dom.refreshQuote.addEventListener("click", () => this.setupQuotes());

      this.dom.copyQuoteBtn.addEventListener("click", () => {
        const text = `"${this.dom.fullQuote.textContent.replace(/"/g, "")}" - ${this.dom.fullAuthor.textContent}`;
        navigator.clipboard.writeText(text);
        this.dom.copyQuoteBtn.innerHTML =
          '<i class="ri-check-line"></i> Copied';
        setTimeout(() => {
          this.dom.copyQuoteBtn.innerHTML =
            '<i class="ri-clipboard-line"></i> Copy';
        }, 2000);
      });

      if (this.dom.userName) {
        const savedName = localStorage.getItem("dash_user_name");
        if (savedName) this.dom.userName.textContent = savedName;

        this.dom.userName.addEventListener("blur", () => {
          localStorage.setItem(
            "dash_user_name",
            this.dom.userName.textContent,
          );
        });
        this.dom.userName.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.dom.userName.blur();
          }
        });
      }
    },

    switchPage(pageId) {
      this.state.activePage = pageId;
      localStorage.setItem("dash_active_page", pageId);

      this.dom.pages.forEach((p) => p.classList.remove("active"));
      document.getElementById(`${pageId}-page`).classList.add("active");

      this.dom.navLinks.forEach((l) => {
        l.classList.toggle("active", l.dataset.page === pageId);
      });

      this.dom.pageTitle.textContent =
        pageId.charAt(0).toUpperCase() + pageId.slice(1);
    },

    applyTheme() {
      document.documentElement.style.setProperty(
        "--primary",
        this.state.accentColor,
      );

      const primaryLight = this.state.accentColor + "22";
      document.documentElement.style.setProperty(
        "--primary-light",
        primaryLight,
      );

      this.dom.body.classList.toggle("dark-mode", this.state.isDarkMode);
      const icon = this.dom.themeToggle.querySelector("i");
      icon.className = this.state.isDarkMode ? "ri-sun-line" : "ri-moon-line";

      this.dom.colorBtns.forEach((btn) => {
        btn.classList.toggle(
          "active",
          btn.dataset.color === this.state.accentColor,
        );
      });
    },

    updateDate() {
      const now = new Date();
      const options = { day: "numeric", month: "short", year: "numeric" };
      this.dom.currentDate.textContent = now.toLocaleDateString(
        "en-US",
        options,
      );
      if (this.dom.currentYear) {
        this.dom.currentYear.textContent = now.getFullYear();
      }

      const hour = now.getHours();
      let greet = "Good morning";
      if (hour >= 12 && hour < 17) greet = "Good afternoon";
      else if (hour >= 17) greet = "Good evening";

      const nameSpan = this.dom.userName
        ? this.dom.userName.outerHTML
        : "Explorer";
      this.dom.greeting.innerHTML = `${greet}, ${nameSpan}`;

      if (this.dom.userName) {
        this.dom.userName = document.getElementById("user-name");
        this.dom.userName.addEventListener("blur", () => {
          localStorage.setItem(
            "dash_user_name",
            this.dom.userName.textContent,
          );
        });
        this.dom.userName.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.dom.userName.blur();
          }
        });
      }
    },

    addTask() {
      const title = this.dom.taskInput.value.trim();
      const desc = this.dom.taskDesc.value.trim();
      const important = this.dom.importantCheckbox.checked;

      if (!title) return;

      this.state.tasks.push({
        id: Date.now(),
        title,
        desc,
        important,
        completed: false,
      });

      this.dom.todoForm.reset();
      this.saveTasks();
      this.renderTasks();
      this.renderMiniTasks();
    },

    saveTasks() {
      localStorage.setItem("dash_tasks", JSON.stringify(this.state.tasks));
    },

    renderTasks(filter = "all") {
      this.dom.allTasks.innerHTML = "";
      let filtered = this.state.tasks;
      if (filter === "important")
        filtered = filtered.filter((t) => t.important);

      if (filtered.length === 0) {
        this.dom.allTasks.innerHTML = `<p class="empty-msg">No tasks found.</p>`;
        return;
      }

      filtered.forEach((task) => {
        const el = document.createElement("div");
        el.className = "task-item";
        el.innerHTML = `
                    <div class="task-info">
                        <h4>${task.title} ${task.important ? '<span class="badge-imp">Important</span>' : ""}</h4>
                        ${task.desc ? `<p>${task.desc}</p>` : ""}
                    </div>
                    <button class="btn-secondary complete-btn" data-id="${task.id}">Done</button>
                `;
        el.querySelector(".complete-btn").addEventListener("click", () =>
          this.completeTask(task.id),
        );
        this.dom.allTasks.appendChild(el);
      });
    },

    completeTask(id) {
      this.state.tasks = this.state.tasks.filter((t) => t.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.renderMiniTasks();
    },

    renderMiniTasks() {
      this.dom.miniTasks.innerHTML = "";
      const priority =
        this.state.tasks.find((t) => t.important) || this.state.tasks[0];

      if (!priority) {
        this.dom.miniTasks.innerHTML = `<p class="empty-msg">All clear for today!</p>`;
        return;
      }

      this.dom.miniTasks.innerHTML = `
                <div class="mini-task-priority">
                    <p class="nav-label">Next Priority</p>
                    <h4>${priority.title}</h4>
                    <p>${priority.desc || "No description"}</p>
                </div>
            `;
    },

    setupPlanner() {
      this.dom.plannerList.innerHTML = "";
      for (let i = 6; i <= 22; i++) {
        const time = `${i}:00`;
        const val = this.state.planner[i] || "";
        const el = document.createElement("div");
        el.className = "planner-slot";
        el.innerHTML = `
                    <span>${time}</span>
                    <input type="text" value="${val}" placeholder="Plan this hour..." data-hour="${i}">
                `;
        el.querySelector("input").addEventListener("input", (e) => {
          this.state.planner[i] = e.target.value;
          localStorage.setItem(
            "dash_planner",
            JSON.stringify(this.state.planner),
          );
        });
        this.dom.plannerList.appendChild(el);
      }
    },

    addGoal() {
      const val = this.dom.goalInput.value.trim();
      if (!val) return;
      this.state.goals.push({ id: Date.now(), text: val, completed: false });
      this.dom.goalInput.value = "";
      this.saveGoals();
      this.renderGoals();
    },

    saveGoals() {
      localStorage.setItem("dash_goals", JSON.stringify(this.state.goals));
    },

    renderGoals() {
      this.dom.goalList.innerHTML = "";
      this.state.goals.forEach((goal) => {
        const li = document.createElement("li");
        li.className = `goal-item ${goal.completed ? "completed" : ""}`;
        li.innerHTML = `
                    <span>${goal.text}</span>
                    <div class="goal-actions">
                        <button class="check-btn">${goal.completed ? "↩️" : "✅"}</button>
                        <button class="del-btn">🗑️</button>
                    </div>
                `;
        li.querySelector(".check-btn").addEventListener("click", () => {
          goal.completed = !goal.completed;
          this.saveGoals();
          this.renderGoals();
        });
        li.querySelector(".del-btn").addEventListener("click", () => {
          this.state.goals = this.state.goals.filter((g) => g.id !== goal.id);
          this.saveGoals();
          this.renderGoals();
        });
        this.dom.goalList.appendChild(li);
      });
    },

    setupFocusTimer() {
      let timer = null;
      let timeLeft = 25 * 60;
      let isWork = true;
      let isRunning = false;

      const updateUI = () => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const timeStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        this.dom.timerDisplay.textContent = timeStr;
        this.dom.miniTimer.textContent = timeStr;
        this.dom.sessionBadge.textContent = isWork
          ? "Work Session"
          : "Break Time";
        this.dom.miniTimerLabel.textContent = isWork
          ? "Work Session"
          : "Break Time";
        this.dom.startBtn.textContent = isRunning
          ? "Running..."
          : "Start Focus";
        this.dom.miniTimerBtn.textContent = isRunning ? "Pause" : "Start";
      };

      const startTimer = () => {
        if (isRunning) return;
        isRunning = true;
        timer = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateUI();
          } else {
            isWork = !isWork;
            timeLeft = isWork ? 25 * 60 : 5 * 60;
            alert(isWork ? "Back to work!" : "Take a break!");
            updateUI();
          }
        }, 1000);
        updateUI();
      };

      const toggleTimer = () => {
        if (isRunning) {
          clearInterval(timer);
          isRunning = false;
        } else {
          startTimer();
        }
        updateUI();
      };

      this.dom.startBtn.addEventListener("click", startTimer);
      this.dom.miniTimerBtn.addEventListener("click", toggleTimer);
      this.dom.pauseBtn.addEventListener("click", () => {
        clearInterval(timer);
        isRunning = false;
        updateUI();
      });
      this.dom.resetBtn.addEventListener("click", () => {
        clearInterval(timer);
        isRunning = false;
        timeLeft = 25 * 60;
        isWork = true;
        updateUI();
      });

      updateUI();
    },

    async setupWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.updateWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
            );
          },
          () => {
            const city = localStorage.getItem("dash_last_city") || "Tokyo, JP";
            this.updateWeather(city);
          },
        );
      } else {
        const city = localStorage.getItem("dash_last_city") || "Tokyo, JP";
        this.updateWeather(city);
      }
    },

    async updateWeatherByCoords(lat, lon) {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
        );
        const weather = await weatherRes.json();

        let locationName = "Current Location";
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
          );
          const geoData = await geoRes.json();
          const city =
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village;
          const countryCode = geoData.address.country_code ? geoData.address.country_code.toUpperCase() : "";
          locationName = city ? (countryCode ? `${city}, ${countryCode}` : city) : "Current Location";
        } catch (e) {
          console.error("Reverse geocoding error:", e);
        }

        this.renderWeatherData(weather, locationName);
      } catch (e) {
        console.error("Weather error:", e);
      }
    },

    async updateWeather(city) {
      if (!city) return;
      try {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
        );
        const geoData = await geoRes.json();
        if (!geoData.results) throw new Error("Not found");
        const loc = geoData.results[0];

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`,
        );
        const weather = await weatherRes.json();

        this.renderWeatherData(weather, `${loc.name}, ${loc.country_code}`);
        localStorage.setItem("dash_last_city", city);
      } catch (e) {
        console.error("Weather error:", e);
      }
    },

    renderWeatherData(weather, locationName) {
      const wmoCodeMap = {
        0: "Clear",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Drizzle",
        53: "Drizzle",
        55: "Drizzle",
        61: "Rain",
        63: "Rain",
        65: "Rain",
        71: "Snow",
        73: "Snow",
        75: "Snow",
        95: "Thunderstorm",
      };

      const weatherEmojiMap = {
        Clear: "☀️",
        Mainly: "🌤️",
        Partly: "⛅",
        Overcast: "☁️",
        Fog: "🌫️",
        Drizzle: "💧",
        Rain: "🌧️",
        Snow: "❄️",
        Thunder: "⛈️",
      };

      const getEmoji = (desc) => {
        for (const key in weatherEmojiMap) {
          if (desc.includes(key)) return weatherEmojiMap[key];
        }
        return "🌤️";
      };

      const desc = wmoCodeMap[weather.current.weather_code] || "Clear";
      const emoji = getEmoji(desc);

      this.dom.weatherLocation.textContent = locationName;
      this.dom.weatherTemp.textContent = `${Math.round(weather.current.temperature_2m)}°C`;
      this.dom.weatherCond.textContent = desc;
      this.dom.weatherIcon.textContent = emoji;
      this.dom.weatherWind.textContent = `${weather.current.wind_speed_10m} km/h`;
      this.dom.weatherHum.textContent = `${weather.current.relative_humidity_2m}%`;

      this.dom.miniWeatherTemp.textContent = `${Math.round(weather.current.temperature_2m)}°C`;
      this.dom.miniWeatherDesc.textContent = desc;
      this.dom.miniWeatherIcon.textContent = emoji;
      this.dom.miniWeatherLoc.textContent = locationName;

      this.dom.forecastGrid.innerHTML = "";
      for (let i = 1; i < 6; i++) {
        const dDesc = wmoCodeMap[weather.daily.weather_code[i]] || "Clear";
        const dEmoji = getEmoji(dDesc);
        const date = new Date(weather.daily.time[i]);
        const dayName = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const fCard = document.createElement("div");
        fCard.className = "forecast-card card";
        fCard.innerHTML = `
                      <p class="day">${dayName}</p>
                      <p class="icon">${dEmoji}</p>
                      <p class="temp">${Math.round(weather.daily.temperature_2m_max[i])}° / ${Math.round(weather.daily.temperature_2m_min[i])}°</p>
                  `;
        this.dom.forecastGrid.appendChild(fCard);
      }
    },

    async setupQuotes() {
      const fetchAndSetQuote = async () => {
        let q = "";
        let a = "";
        try {
          const res = await fetch(
            "https://motivational-spark-api.vercel.app/api/quotes/random",
          );
          const data = await res.json();
          q = `"${data.quote}"`;
          a = `${data.author}`;
        } catch (e) {
          q = '"Success is not final, failure is not fatal."';
          a = "Winston Churchill";
        }

        this.dom.fullQuote.textContent = q;
        this.dom.fullAuthor.textContent = a;
        this.dom.miniQuote.textContent = q;
        this.dom.miniAuthor.textContent = `- ${a}`;
      };

      if (this.dom.quoteContentWrapper) {
        this.dom.quoteContentWrapper.classList.remove("fade-content");
        void this.dom.quoteContentWrapper.offsetWidth;

        await fetchAndSetQuote();

        this.dom.quoteContentWrapper.classList.add("fade-content");
      } else {
        await fetchAndSetQuote();
      }
    },

    render() {
      this.switchPage(this.state.activePage);
      this.renderTasks();
      this.renderMiniTasks();
      this.setupPlanner();
      this.renderGoals();
    },
  };

  App.init();
});
