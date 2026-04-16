let selectionSlots = [
  { game: null, version: null, day: "D0", versionPage: 0 },
  { game: null, version: null, day: "D0", versionPage: 0 },
];
const STUDIO_GAMES = {
  "Detective IQ 1": {
    shortName: "DIQ 1",
    package: "com.myl.detective.iq1",
    tags: [
      "Puzzle",
      "Brain teaser",
      "Casual",
      "Single player",
      "Stylised",
      "Offline",
    ],
    icon: "https://play-lh.googleusercontent.com/NwByB-HJl5P0AJTb1Pe9xsx2UVpbsG-9ro1hiIYKW4EqsPoWwGszLCsS9Ry5WdG5dN1G=w240-h480-rw",
    platforms: ["android"],
  },
  "Detective IQ 1 ios": {
    shortName: "DIQ 1",
    package: "com.myl.detective.iq1.ios",
    tags: ["Puzzle"],
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/39/2e/7a/392e7af1-337a-0ec7-8e21-94c77c8d50a2/AppIcon-1x_U007emarketing-0-8-0-85-220-0.png/200x200ia-75.webp",
    platforms: ["ios"],
  },
  "Detective IQ 2": {
    shortName: "DIQ 2",
    package: "com.myl.detective.iq2",
    tags: [
      "Puzzle",
      "Brain teaser",
      "Casual",
      "Single player",
      "Stylised",
      "Funny",
      "Offline",
    ],
    icon: "https://play-lh.googleusercontent.com/8CXT3yJWEE1kfIxDEN5xGSaB3gUiCxs3eeUg-4JwXNQE0G8oklwmxJxTrNWsg3ektidX=w240-h480-rw",
    platforms: ["android"],
  },
  "Detective IQ 2 ios": {
    shortName: "DIQ 2",
    package: "com.myl.detective.iq2.ios",
    tags: ["Puzzle"],
    icon: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/8f/9b/3c/8f9b3ccc-d6df-8b7b-f05b-57af4e461954/Placeholder.mill/200x200bb-75.webp",
    platforms: ["ios"],
  },
  "Detective IQ 3": {
    shortName: "DIQ 3",
    package: "com.myl.detective.iq3",
    tags: ["Puzzle"],
    icon: "https://play-lh.googleusercontent.com/FHK6WetkmM6p18210H2nMS1G4CGwyG9KpnJSLPXhaztPt1hTH7pAtzJdwhEWFRiqUf8=w240-h480-rw",
    platforms: ["android"],
  },
  "Ghost IQ": {
    shortName: "GIQ",
    package: "com.myl.ghost.iq",
    tags: ["Puzzle"],
    icon: "https://play-lh.googleusercontent.com/R9ccBYwNhhayk9Rb81wM6K64I1snF8UqSDQBf8m0Kjiq2a0KQ13frTd8vt2ZXzPrSFSEIhuxrna12_XTXoxG=w240-h480-rw",
    platforms: ["android"],
  },
};
// Hardcoded Test Data for DIQ 3
const MOCK_DATABASE = {
  "Detective IQ 3_56_D0": [
    15000, 58.0, 30.5, 20.0, 13.0, 7.0, 4.0, 21.0, 8.0, 2.0, 0.5, 0.1, 8.5,
    12500, 65.0, 35.0, 23.0, 15.0, 8.0, 4.5, 83.33, 240.0, 920.0, 25.4, 14.2,
    5.1, 42.0, 125,
  ],
  "Detective IQ 3_57_D0": [
    18000, 62.15, 35.4, 22.8, 15.2, 9.1, 5.3, 24.5, 10.2, 4.1, 1.2, 0.25, 9.45,
    15500, 68.3, 38.2, 25.1, 18.4, 10.2, 6.15, 86.11, 260.5, 1050.2, 28.15,
    16.4, 4.25, 38.1, 140,
  ],
  "Detective IQ 2_108_D0": [
    22000, 55.2, 28.4, 18.15, 11.0, 5.2, 2.45, 18.6, 6.1, 1.55, 0.35, 0.05,
    7.82, 18500, 60.15, 31.4, 20.25, 12.1, 6.4, 3.15, 84.09, 210.3, 810.5, 22.1,
    12.35, 7.15, 48.2, 110,
  ],
  "Detective IQ 2_120_D0": [
    25000, 65.45, 40.1, 28.3, 20.15, 12.4, 8.2, 30.15, 15.4, 8.25, 3.1, 1.15,
    11.55, 22000, 75.2, 45.15, 32.4, 22.15, 14.3, 9.1, 88.0, 305.8, 1220.4,
    32.5, 18.1, 3.25, 30.15, 165,
  ],
};

let metadata = {
  games: Object.keys(STUDIO_GAMES),
  versions: Object.keys(STUDIO_GAMES).reduce(
    (acc, game) => ({
      ...acc,
      [game]:
        game === "Detective IQ 3"
          ? ["56", "57"]
          : game === "Detective IQ 2"
            ? ["108", "120"]
            : [],
    }),
    {},
  ),
};

// State management
let dashboardMode = "single";
let retentionChartMode = "install";
let performanceMode = "impact"; // 'impact' or 'efficiency'
let lastData = null;
let activeInjection = { game: null, version: null, day: null };
let baseSelection = { game: null, version: null, day: null };
let compSelection = { game: null, version: null, day: null };
let currentTargetContext = "inject";

function setDashboardMode(mode) {
  const isCompare = mode === "compare";
  dashboardMode = mode;

  const els = {
    singleBtn: document.getElementById("mode-single"),
    compareBtn: document.getElementById("mode-compare"),
    singleNav: document.getElementById("single-nav-controls"),
    compareNav: document.getElementById("compare-nav-controls"),
    singleActions: document.getElementById("single-mode-actions"),
    titlePro: document.getElementById("title-pro"),
    gameHeader: document.getElementById("game-header"),
  };

  // 1. Toggle Static UI Elements (Instant or CSS Transitioned)
  els.titlePro.classList.toggle("active-pro", isCompare);
  if (isCompare) els.gameHeader?.classList.add("hidden");
  else if (baseSelection.game) els.gameHeader?.classList.remove("hidden");

  // Update Toggle Button Styles
  els.singleBtn.className = `px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${!isCompare ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`;
  els.compareBtn.className = `px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${isCompare ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`;

  // 2. Handle Nav Transition Logic
  const showEl = isCompare ? els.compareNav : els.singleNav;
  const hideEl = isCompare ? els.singleNav : els.compareNav;

  // Start exit animation without removing layout classes to keep center alignment stable
  hideEl.classList.remove("nav-control-fade");
  hideEl.classList.add("nav-control-exit");

  if (isCompare) els.singleActions?.classList.add("nav-control-exit");

  setTimeout(() => {
    // Clean up hidden elements and remove layout classes only AFTER animation
    hideEl.classList.add("hidden");
    hideEl.classList.remove("nav-control-exit", "flex");

    if (isCompare) {
      els.singleActions?.classList.add("hidden");
      els.singleActions?.classList.remove(
        "nav-control-exit",
        "nav-control-fade",
        "flex",
      );
    } else {
      els.singleActions?.classList.remove("hidden", "nav-control-exit");
      els.singleActions?.classList.add("flex", "nav-control-fade");
    }

    // Show new element
    showEl.classList.remove("hidden", "nav-control-exit");
    showEl.classList.add("flex", "nav-control-fade");

    if (isCompare) renderCompSlots();
    refreshDashboard();
  }, 250); // Matches the 0.25s CSS animation duration exactly
}

function renderCompSlots() {
  const container = document.getElementById("comp-slots-container");
  if (!container) return;

  container.innerHTML = selectionSlots
    .map((slot, i) => {
      const gameData = slot.game ? STUDIO_GAMES[slot.game] : null;
      const cleanGame = slot.game
        ? gameData.shortName || slot.game.replace(/\s*ios\s*$/i, "")
        : "Select Game";
      const slotLabel = String.fromCharCode(65 + i);

      return `
      <div class="slot-row-wrapper bg-slate-50/30 rounded-[2rem] p-4 border border-transparent hover:border-slate-100 transition-all">
        <div class="flex items-center gap-6">
          <div class="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 bg-white">${slotLabel}</div>
          <div class="flex-1 flex items-center gap-3">
            <div class="flex-1">
              <button onclick="toggleSlotDropdown('GAME', ${i}, 'sd-g-${i}')" class="w-full flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-400 transition-all shadow-sm">
                ${slot.game ? `<img src="${gameData.icon}" class="w-6 h-6 rounded-lg object-cover border border-slate-100" />` : ""}
                <div class="text-left">
                  <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">Game Switch</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-700">${cleanGame}</span>
                    <i class="fas fa-chevron-down text-[10px] text-slate-400"></i>
                  </div>
                </div>
              </button>
            </div>
            <div class="flex-1">
              <button onclick="toggleSlotDropdown('VERSION', ${i}, 'sd-v-${i}')" ${!slot.game ? "disabled" : ""} class="w-full flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="text-left">
                  <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">Active Version</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold ${slot.version ? "text-blue-600" : "text-slate-700"}">${slot.version || "None Selected"}</span>
                    <i class="fas fa-chevron-down text-[10px] text-slate-400"></i>
                  </div>
                </div>
              </button>
            </div>
            <div class="flex-1">
              <button onclick="toggleSlotDropdown('DAY', ${i}, 'sd-d-${i}')" class="w-full flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-blue-400 transition-all shadow-sm">
                <div class="text-left">
                  <p class="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter leading-none mb-0.5">Active Day</p>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-700">${slot.day || "Day 0"}</span>
                    <i class="fas fa-chevron-down text-[10px] text-slate-400"></i>
                  </div>
                </div>
              </button>
            </div>
          </div>
          ${i > 1 ? `<button onclick="removeSlot(${i})" class="w-8 h-8 aspect-square rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all flex items-center justify-center flex-none shadow-lg shadow-rose-100"><i class="fas fa-times text-[10px]"></i></button>` : '<div class="w-8 flex-none"></div>'}
        </div>
        </div>
        <div id="sd-g-${i}" class="slot-dropdown hidden mt-4"></div>
        <div id="sd-v-${i}" class="slot-dropdown hidden mt-4"></div>
        <div id="sd-d-${i}" class="slot-dropdown hidden mt-4"></div>
      </div>`;
    })
    .join("");

  const activeCount = selectionSlots.filter((s) => s.game && s.version).length;
  const countEl = document.getElementById("comp-slots-count");
  if (countEl) countEl.innerText = `${activeCount} Active`;

  // Explicitly hide the add button container when 4 slots are reached
  const addBtnContainer = document.getElementById("add-slot-container");
  if (addBtnContainer) {
    if (selectionSlots.length >= 4) {
      addBtnContainer.classList.add("hidden");
    } else {
      addBtnContainer.classList.remove("hidden");
    }
  }
}

function toggleSlotDropdown(type, index, id) {
  const dropdown = document.getElementById(id);
  const isHidden = dropdown.classList.contains("hidden");

  // Close all other dropdowns in all slots first
  document
    .querySelectorAll(".slot-dropdown")
    .forEach((d) => d.classList.add("hidden"));

  if (!isHidden) return;

  const state = selectionSlots[index];
  let content = "";

  if (type === "GAME") {
    content =
      `
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-inner">
        <div class="flex items-center justify-between mb-4 px-2">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Game Library</span>
          <input type="text" placeholder="Filter..." class="w-32 text-[10px] p-1.5 bg-slate-50 rounded-lg outline-none border border-slate-100 focus:border-blue-300" oninput="filterSlotGames(${index})">
        </div>
        <div class="slot-game-list grid grid-cols-3 gap-2">` +
      Object.keys(STUDIO_GAMES)
        .map((key) => {
          const data = STUDIO_GAMES[key];
          const isSelected = state.game === key;
          const pIcon = data.platforms.includes("android")
            ? "android"
            : "apple";
          return `
          <div class="nav-item ${isSelected ? "selected" : ""} !h-10 !rounded-xl" data-search="${key.toLowerCase()}" onclick="pickOption('GAME', '${key}', '${index}')">
            <img src="${data.icon}" class="!w-5 !h-5" /><p class="!text-[11px]">${data.shortName || key}</p>
            <div class="platform-icon-wrap"><i class="fab fa-${pIcon} ${pIcon === "android" ? "text-emerald-500" : "text-slate-400"} text-[9px]"></i></div>
          </div>`;
        })
        .join("") +
      `</div></div>`;
  } else if (type === "VERSION") {
    content = `
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-inner">
        <div class="flex items-center justify-between mb-4 px-2">
          <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Versions</span>
          <input type="text" id="slot-v-search-${index}" placeholder="Search..." class="w-32 text-[10px] p-1.5 bg-slate-50 rounded-lg outline-none border border-slate-100 focus:border-blue-300" oninput="filterSlotVersions(${index})">
        </div>
        <div id="sd-v-list-${index}" class="slot-version-list"></div>
        <div id="sd-v-nav-${index}"></div>
      </div>`;
    dropdown.innerHTML = content;
    dropdown.classList.remove("hidden");
    updateSlotVersionUI(index);
    return; // UI is handled by updateSlotVersionUI
  } else {
    content =
      `
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-inner">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Retention Day Context</p>
        <div class="grid grid-cols-3 gap-2">` +
      ["D0", "D7", "D30"]
        .map(
          (d) =>
            `<button class="list-item !min-h-[36px] !text-[11px] !justify-center ${state.day === d ? "selected" : ""}" onclick="pickOption('DAY', '${d}', '${index}')">${d}</button>`,
        )
        .join("") +
      `</div></div>`;
  }

  dropdown.innerHTML = content;
  dropdown.classList.remove("hidden");
  dropdown.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function updateSlotVersionUI(index, query = "") {
  const state = selectionSlots[index];
  const listContainer = document.getElementById(`sd-v-list-${index}`);
  const navContainer = document.getElementById(`sd-v-nav-${index}`);
  if (!listContainer || !navContainer) return;

  let versions = [...(metadata.versions[state.game] || [])].reverse();
  if (query) {
    versions = versions.filter((v) =>
      v.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const pageSize = 6;
  const totalPages = Math.ceil(versions.length / pageSize);

  // Auto-reset page if query makes it out of bounds
  if (state.versionPage >= totalPages && totalPages > 0) state.versionPage = 0;

  const start = state.versionPage * pageSize;
  const pageVersions = versions.slice(start, start + pageSize);

  listContainer.innerHTML = pageVersions
    .map(
      (v) =>
        `<button class="list-item !min-h-[32px] !text-[11px] !justify-center" onclick="pickOption('VERSION', '${v}', '${index}')">${v}</button>`,
    )
    .join("");

  // Pagination Controls
  let navHtml = "";
  if (totalPages > 1) {
    const hasPrev = state.versionPage > 0;
    const hasNext = state.versionPage < totalPages - 1;

    navHtml = `
      <div class="flex justify-end items-center gap-4 mt-4 px-2">
        <span class="text-[9px] font-bold text-slate-300 uppercase mr-auto">Page ${state.versionPage + 1} of ${totalPages}</span>
        ${hasPrev ? `<button onclick="changeSlotVersionPage(${index}, -1)" class="text-slate-900 hover:text-blue-600 transition-colors text-lg">⮜</button>` : ""}
        ${hasNext ? `<button onclick="changeSlotVersionPage(${index}, 1)" class="text-slate-900 hover:text-blue-600 transition-colors text-lg">⮞</button>` : ""}
      </div>`;
  }
  navContainer.innerHTML = navHtml;
}

function changeSlotVersionPage(index, direction) {
  selectionSlots[index].versionPage += direction;
  const query = document.getElementById(`slot-v-search-${index}`)?.value || "";
  updateSlotVersionUI(index, query);
}

function addNewSlot() {
  if (selectionSlots.length >= 4) return;
  selectionSlots.push({
    game: selectionSlots[0].game,
    version: null,
    day: "D0",
    versionPage: 0,
  });
  renderCompSlots();
}

function removeSlot(index) {
  selectionSlots.splice(index, 1);
  renderCompSlots();
  refreshDashboard();
}

function switchTab(tabId) {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  document
    .querySelectorAll(".tab-view")
    .forEach((view) => view.classList.add("hidden"));
  const activeView = document.getElementById(`view-${tabId}`);
  if (activeView) activeView.classList.remove("hidden");

  // Double RAF ensures the browser has finished layout paint before the chart initializes
  if (lastData) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (tabId === "retention") renderRetentionChart();
        if (tabId === "ads") renderAdDepthChart(lastData.slice(7, 12));
        if (tabId === "performance") renderFrictionChart();
      });
    });
  }
}

function openSelection(type, context = "inject") {
  currentTargetContext = context;
  const modal = document.getElementById("selection-modal");
  const title = document.getElementById("selection-title");
  const list = document.getElementById("selection-list");
  const addBtn = document.getElementById("selection-add-btn");

  let state;
  if (context === "inject") state = activeInjection;
  else if (context === "base") state = baseSelection;
  else state = selectionSlots[parseInt(context)];

  title.innerText = `Select ${type}`;
  list.innerHTML = "";
  modal.classList.remove("hidden");

  // Apply Grid Layouts
  list.className =
    "flex-1 overflow-y-auto pr-2 custom-scrollbar " +
    (type === "GAME" ? "selection-2col-grid" : "selection-grid-view");

  if (type === "GAME") {
    addBtn.classList.remove("hidden");
    addBtn.onclick = () => openInputModal("GAME", "selection", "");
    list.innerHTML = metadata.games
      .map((g) => {
        const data = STUDIO_GAMES[g];
        const isSelected = state.game === g;
        const displayName = data?.shortName || g.replace(/\s*ios\s*$/i, "");
        const platformIcon = data?.platforms.includes("android")
          ? '<i class="fab fa-android text-emerald-500 text-[10px]"></i>'
          : '<i class="fab fa-apple text-slate-400 text-[10px]"></i>';

        return `
        <div class="nav-item ${isSelected ? "selected" : ""}" onclick="pickOption('GAME', '${g}', '${context}')">
          <img src="${data?.icon || "https://via.placeholder.com/32"}" alt="${g}" />
          <p>${displayName}</p>
          <div class="platform-icon-wrap">${platformIcon}</div>
        </div>`;
      })
      .join("");
  } else if (type === "VERSION") {
    addBtn.classList.remove("hidden");
    addBtn.onclick = () => openInputModal("VERSION", "selection", state.game);
    const versions = metadata.versions[state.game] || [];
    list.innerHTML = versions
      .map(
        (v) => `
      <button class="list-item ${state.version === v ? "selected" : ""}" onclick="pickOption('VERSION', '${v}', '${context}')">${v}</button>
    `,
      )
      .join("");
  } else if (type === "DAY") {
    addBtn.classList.add("hidden");
    list.innerHTML = ["D0", "D7", "D30"]
      .map(
        (d) => `
      <button class="list-item ${state.day === d ? "selected" : ""}" onclick="pickOption('DAY', '${d}', '${context}')">${d}</button>
    `,
      )
      .join("");
  }
}

function pickOption(type, value, context = "inject") {
  let state =
    context === "inject"
      ? activeInjection
      : context === "base"
        ? baseSelection
        : selectionSlots[context];
  state[type.toLowerCase()] = value;

  if (context === "inject") {
    const btnId = `btn-select-${type.toLowerCase()}`;
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.classList.replace("empty", "filled");

      if (type === "GAME") {
        const gData = STUDIO_GAMES[value];
        const pIcon = gData.platforms.includes("android")
          ? "fab fa-android"
          : "fab fa-apple";
        btn.innerHTML = `<i class="fas fa-gamepad opacity-60"></i> <span class="flex-1 text-left ml-2">${gData.shortName || value}</span> <i class="${pIcon} text-[10px] opacity-60"></i>`;
        document.getElementById("btn-select-version").disabled = false;
      } else if (type === "VERSION") {
        btn.innerHTML = `<i class="fas fa-code-branch opacity-60"></i> <span class="flex-1 text-left ml-2">${value}</span>`;
      } else {
        btn.innerHTML = `<i class="fas fa-calendar-day opacity-60"></i> <span class="flex-1 text-left ml-2">${value}</span>`;
      }
    }
    validateInjection();
  } else if (context === "base") {
    if (type === "GAME") {
      syncNavSwitcher(value);
      state.version = null;
      document.getElementById("nav-current-version").innerText =
        "None Selected";
    } else if (type === "VERSION") {
      document.getElementById("nav-current-version").innerText = value;
    } else if (type === "DAY") {
      document.getElementById("nav-current-day").innerText = value;
    }
  } else {
    renderCompSlots();
    document
      .querySelectorAll(".slot-dropdown")
      .forEach((d) => d.classList.add("hidden"));
  }

  closeSelection();
  refreshDashboard();
}

function refreshDashboard() {
  const gameHeader = document.getElementById("game-header");
  if (dashboardMode === "single") {
    const g = baseSelection.game,
      v = baseSelection.version,
      d = baseSelection.day || "D0";

    if (g) updateGameHeader(g);

    if (!g || !v) return;
    const data = MOCK_DATABASE[`${g}_${v}_${d}`];
    if (data) updateDashboardUI(data);
  } else {
    gameHeader?.classList.add("hidden");
    const activeSlots = selectionSlots.filter((s) => s.game && s.version);
    if (activeSlots.length < 2) return;
    const baseData =
      MOCK_DATABASE[
        `${activeSlots[0].game}_${activeSlots[0].version}_${activeSlots[0].day}`
      ];
    const compData =
      MOCK_DATABASE[
        `${activeSlots[1].game}_${activeSlots[1].version}_${activeSlots[1].day}`
      ];
    if (baseData) updateDashboardUI(baseData, compData);
  }
}
function updateGameHeader(gameName) {
  const header = document.getElementById("game-header");
  const nameEl = document.getElementById("header-game-name");
  const packageEl = document.getElementById("header-package-name");
  const tagsEl = document.getElementById("header-tags");
  const iconEl = document.getElementById("header-app-icon");
  const androidIcon = document.getElementById("header-platform-android");
  const iosIcon = document.getElementById("header-platform-ios");

  const data = STUDIO_GAMES[gameName];
  header.classList.remove("hidden");

  // Clean name for header
  nameEl.innerText = gameName.replace(/\s*ios\s*$/i, "");

  if (data) {
    packageEl.innerText = data.package;
    iconEl.src = data.icon;
    tagsEl.innerHTML = data.tags
      .map((t) => `<span class="game-tag">${t}</span>`)
      .join("");
    androidIcon.classList.toggle("hidden", !data.platforms.includes("android"));
    iosIcon.classList.toggle("hidden", !data.platforms.includes("ios"));
  } else {
    packageEl.innerText = "package.not.available";
    iconEl.src = "https://via.placeholder.com/150?text=App+Icon";
    tagsEl.innerHTML = `<span class="game-tag text-slate-400">Custom Title</span>`;
    androidIcon.classList.add("hidden");
    iosIcon.classList.add("hidden");
  }
}
let currentInputTarget = null;
let currentActiveSelect = null;
let charts = {}; // Consolidated chart storage

function closeSelection() {
  document.getElementById("selection-modal").classList.add("hidden");
}

function syncAllDropdowns() {
  const targets = ["base-game", "comp-game"];
  targets.forEach((id) => {
    const grid = document.getElementById(`${id}-grid`);
    if (!grid) return;
    grid.innerHTML =
      metadata.games
        .map(
          (g) => `
      <div class="filter-item" data-value="${g}" onclick="selectOption('${id}', '${g}')">
          <div class="custom-checkbox"></div> <span>${g}</span>
      </div>`,
        )
        .join("") +
      `
      <div class="filter-item add-new-btn" onclick="openInputModal('GAME', '${id}')">
          <i class="fas fa-plus"></i> Add Game
      </div>`;
  });
}

function openInputModal(type, el, gameContext = "") {
  currentInputTarget = type;
  currentActiveSelect = el;
  const modal = document.getElementById("input-modal");
  const title = document.getElementById("input-modal-title");
  const desc = document.getElementById("input-modal-desc");
  const input = document.getElementById("custom-input-field");

  title.innerText = type === "GAME" ? "Add New Game" : "Add New Version";
  desc.innerText =
    type === "GAME"
      ? "Enter the new game title."
      : `Add a version for ${gameContext}.`;
  input.value = "";
  modal.classList.remove("hidden");
  input.focus();
}

function closeInputModal() {
  document.getElementById("input-modal").classList.add("hidden");
}

function submitInputModal() {
  let val = document.getElementById("custom-input-field").value.trim();
  if (!val) return;

  // Validation: Version must be numeric/decimal only (no symbols or alphabets)
  if (currentInputTarget === "VERSION") {
    const numericVal = val.replace(/[^0-9.]/g, "");
    if (!numericVal || numericVal !== val) {
      alert("Error: Version must be numbers or decimals only.");
      return;
    }
  }

  if (currentInputTarget === "GAME") {
    if (!metadata.games.includes(val)) {
      metadata.games.push(val);
      metadata.versions[val] = [];
      syncAllDropdowns();
      const context = currentActiveSelect.includes("base")
        ? "base"
        : currentActiveSelect.includes("comp")
          ? "comp"
          : "inject";
      pickOption("GAME", val, context);
    }
  } else {
    const context = currentActiveSelect.includes("base")
      ? "base"
      : currentActiveSelect.includes("comp")
        ? "comp"
        : "inject";
    const state =
      context === "inject"
        ? activeInjection
        : context === "base"
          ? baseSelection
          : compSelection;
    if (state.game && !metadata.versions[state.game].includes(val)) {
      metadata.versions[state.game].push(val);
      pickOption("VERSION", val, context);
    }
  }
  document.getElementById("input-modal").classList.add("hidden");
}

let pendingRowData = null;

function previewData() {
  const textarea = document.getElementById("inject-textarea");
  const rawData = textarea.value.trim();
  if (!rawData) return;

  const row = rawData
    .split(/[\t\n\r]+/)
    .map((val) => parseFloat(val.replace(/,/g, "").replace(/%/g, "")));

  if (row.length < 28) {
    alert(`⚠️ Error: Found ${row.length} KPIs, 28 expected.`);
    return;
  }

  pendingRowData = row;

  // Hide upload form and show clean success popup
  document.getElementById("upload-modal").classList.add("hidden");
  const successModal = document.getElementById("inject-success-modal");
  successModal.classList.remove("hidden");
  textarea.value = "";

  // Auto-close logic: 800ms for animation + 2s "stay" time
  setTimeout(() => {
    finalizeInjection();
  }, 1800);
}

function finalizeInjection() {
  if (pendingRowData) {
    updateDashboardUI(pendingRowData);
    pendingRowData = null;
  }
  document.getElementById("inject-success-modal").classList.add("hidden");
}

function updateDashboardUI(data) {
  lastData = data;

  // Reconstruct Tab Layouts from placeholders to active containers
  document.getElementById("view-overview").className = "tab-view space-y-8";
  document.getElementById("view-overview").innerHTML =
    `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="kpi-cards-container"></div>`;

  document.getElementById("view-retention").className =
    "tab-view hidden space-y-8";
  document.getElementById("view-retention").innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="retention-cards-container"></div>
    <div class="premium-card p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h4 class="text-lg font-bold text-slate-800">Retention Progression</h4><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Level-based User Drop-off</p></div>
        <div class="flex items-center gap-4">
          <div class="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button onclick="toggleRetentionMode('install')" id="btn-ret-install" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600">Vs Install</button>
            <button onclick="toggleRetentionMode('onboard')" id="btn-ret-onboard" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700">Vs Onboarded</button>
          </div>
          <div class="relative group">
            <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all flex items-center justify-center"><i class="fas fa-info-circle"></i></button>
            <div class="absolute right-0 top-10 w-72 bg-slate-900 text-white text-[11px] p-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl pointer-events-none leading-relaxed" id="ret-info-content"></div>
          </div>
        </div>
      </div>
      <div class="h-[400px] chart-container-stable"><canvas id="funnelChart"></canvas></div>
    </div>`;

  document.getElementById("view-ads").className = "tab-view hidden space-y-8";
  document.getElementById("view-ads").innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" id="ad-cards-container"></div>
    <div class="premium-card p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div><h4 class="text-lg font-bold text-slate-800">Ad Depth Analysis</h4><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Threshold Reach & Conversion Table</p></div>
        <div class="relative group">
          <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all flex items-center justify-center"><i class="fas fa-info-circle"></i></button>
          <div class="absolute right-0 top-10 w-72 bg-slate-900 text-white text-[11px] p-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl pointer-events-none leading-relaxed" id="ads-info-content"></div>
        </div>
      </div>
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        <div class="h-[350px] chart-container-stable lg:w-3/5"><canvas id="adDepthChart"></canvas></div>
        <div class="w-full lg:w-2/5 bg-white/50 rounded-2xl border border-slate-100 p-2 overflow-hidden" id="ad-depth-table-container"></div>
      </div>
    </div>`;

  document.getElementById("view-performance").className =
    "tab-view hidden space-y-8";
  document.getElementById("view-performance").innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="performance-cards-container"></div>
    <div class="premium-card p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h4 class="text-lg font-bold text-slate-800" id="perf-chart-title">Friction Drop Analysis</h4><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identifying Level Progression Bottlenecks</p></div>
        <div class="flex items-center gap-4">
          <div class="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button onclick="togglePerformanceMode('impact')" id="btn-perf-impact" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600">Friction Drop</button>
            <button onclick="togglePerformanceMode('efficiency')" id="btn-perf-efficiency" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700">Group Performance</button>
          </div>
          <div class="relative group">
            <button class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all flex items-center justify-center"><i class="fas fa-info-circle"></i></button>
            <div class="absolute right-0 top-10 w-72 bg-slate-900 text-white text-[11px] p-6 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl pointer-events-none leading-relaxed" id="perf-info-content"></div>
          </div>
        </div>
      </div>
      <div id="perf-legend-container" class="mb-8"></div>
      <div class="h-[380px] chart-container-stable"><canvas id="frictionChart"></canvas></div>
    </div>`;

  const overviewContainer = document.getElementById("kpi-cards-container");
  const retentionContainer = document.getElementById(
    "retention-cards-container",
  );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  const tailwindColors = {
    blue: { hex: "#3b82f6", glass: "rgba(59, 130, 246, 0.12)" },
    orange: { hex: "#f97316", glass: "rgba(249, 115, 22, 0.12)" },
    emerald: { hex: "#10b981", glass: "rgba(16, 185, 129, 0.12)" },
    violet: { hex: "#8b5cf6", glass: "rgba(139, 92, 246, 0.12)" },
    indigo: { hex: "#6366f1", glass: "rgba(99, 102, 241, 0.12)" },
    rose: { hex: "#f43f5e", glass: "rgba(244, 63, 94, 0.12)" },
  };

  const generateCard = (c, i) => `
    <div class="premium-card p-7 group" style="--card-color: ${tailwindColors[c.color].hex}; --card-tint: ${tailwindColors[c.color].glass}; animation-delay: ${i * 60}ms">
      <div class="flex justify-between items-center mb-10">
        <div class="card-icon-container w-14 h-14 bg-white text-${c.color}-600 rounded-2xl text-xl shadow-sm border border-slate-50">
          <i class="fas ${c.icon}"></i>
        </div>
        <div class="flex flex-col items-end">
           <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Data Source</span>
           <div class="flex items-center gap-1.5 mt-1">
             <div class="w-1.5 h-1.5 rounded-full bg-${c.color}-500 animate-pulse"></div>
             <span class="text-[8px] font-bold text-${c.color}-600 uppercase">Synced</span>
           </div>
        </div>
      </div>
      <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 group-hover:text-slate-600 transition-colors">${c.label}</p>
      <div class="flex items-baseline">
        <h3 class="text-4xl font-extrabold text-slate-800 tracking-tighter">${c.val}</h3>
      </div>
    </div>`;

  const overviewCards = [
    {
      label: "Total Installs",
      val: data[0].toLocaleString(),
      icon: "fa-download",
      color: "blue",
    },
    {
      label: "ROAS",
      val: data[27].toFixed(2) + "%",
      icon: "fa-funnel-dollar",
      color: "orange",
    },
    {
      label: "Avg Ad per User",
      val: data[12].toFixed(2),
      icon: "fa-rectangle-ad",
      color: "emerald",
    },
    {
      label: "Install to Onboard %",
      val: data[20].toFixed(2) + "%",
      icon: "fa-rocket",
      color: "violet",
    },
    {
      label: "D1 Retention",
      val: data[23].toFixed(2) + "%",
      icon: "fa-calendar-check",
      color: "indigo",
    },
    {
      label: "Avg Playtime",
      val: formatTime(data[22]),
      icon: "fa-stopwatch-20",
      color: "rose",
    },
  ];

  const retentionCards = [
    {
      label: "Onboarded Users",
      val: data[13].toLocaleString(),
      icon: "fa-user-plus",
      color: "violet",
    },
    {
      label: "D1 Retention",
      val: data[23].toFixed(2) + "%",
      icon: "fa-calendar-day",
      color: "indigo",
    },
    {
      label: "D3 Retention",
      val: data[24].toFixed(2) + "%",
      icon: "fa-calendar-week",
      color: "blue",
    },
  ];

  const adCards = [
    {
      label: "ROAS",
      val: data[27].toFixed(2) + "%",
      icon: "fa-funnel-dollar",
      color: "orange",
    },
    {
      label: "Avg Ad per User",
      val: data[12].toFixed(2),
      icon: "fa-rectangle-ad",
      color: "emerald",
    },
    {
      label: "User Ad Failure Rate",
      val: data[25].toFixed(2) + "%",
      icon: "fa-user-slash",
      color: "rose",
    },
    {
      label: "Ad Request Failure %",
      val: data[26].toFixed(2) + "%",
      icon: "fa-triangle-exclamation",
      color: "orange",
    },
  ];

  const performanceCards = [
    {
      label: "Onboarded Users",
      val: data[13].toLocaleString(),
      icon: "fa-users-gear",
      color: "violet",
    },
    {
      label: "Avg. Session Length",
      val: data[21].toFixed(0) + " sec",
      icon: "fa-stopwatch",
      color: "blue",
    },
    {
      label: "Avg. Playtime",
      val: data[22].toFixed(0) + " sec",
      icon: "fa-bolt",
      color: "rose",
    },
  ];

  overviewContainer.innerHTML = overviewCards
    .map((c, i) => generateCard(c, i))
    .join("");
  retentionContainer.innerHTML = retentionCards
    .map((c, i) => generateCard(c, i))
    .join("");
  document.getElementById("ad-cards-container").innerHTML = adCards
    .map((c, i) => generateCard(c, i))
    .join("");
  document.getElementById("performance-cards-container").innerHTML =
    performanceCards.map((c, i) => generateCard(c, i)).join("");

  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;

  // Render the current tab immediately; others will render when clicked via switchTab
  if (activeTab === "retention") renderRetentionChart();
  if (activeTab === "ads") renderAdDepthChart(data.slice(7, 12));
  if (activeTab === "performance") renderFrictionChart();
}

function toggleRetentionMode(mode) {
  retentionChartMode = mode;
  const instBtn = document.getElementById("btn-ret-install");
  const onbBtn = document.getElementById("btn-ret-onboard");

  if (mode === "install") {
    instBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600";
    onbBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700";
  } else {
    onbBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600";
    instBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700";
  }
  renderRetentionChart();
}

function renderRetentionChart() {
  if (!lastData) return;
  const ctx = document.getElementById("funnelChart").getContext("2d");
  const infoContent = document.getElementById("ret-info-content");
  if (retentionChartMode === "install") {
    infoContent.innerHTML = `
      <p class="text-blue-400 font-black uppercase tracking-widest text-[9px] mb-2">Vs Install</p>
      <p class="text-slate-300">Tracks retention from the first time the app is opened to each level reached. This represents the absolute user funnel from install.</p>`;
  } else {
    infoContent.innerHTML = `
      <p class="text-violet-400 font-black uppercase tracking-widest text-[9px] mb-2">Vs Onboarded</p>
      <p class="text-slate-300">Tracks retention from the start of Level 1 or 2 (onboarding completion) to each hit point. This measures how well players stay after actually starting the game.</p>`;
  }

  const values =
    retentionChartMode === "install"
      ? lastData.slice(1, 7)
      : lastData.slice(14, 20);

  const label =
    retentionChartMode === "install" ? "Reach %" : "Onboard to Lvl %";
  const themeColor = retentionChartMode === "install" ? "#3b82f6" : "#8b5cf6";
  const gradientColor =
    retentionChartMode === "install" ? "59, 130, 246" : "139, 92, 246";

  if (charts.funnel) charts.funnel.destroy();
  charts.funnel = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lvl 20", "Lvl 50", "Lvl 70", "Lvl 100", "Lvl 150", "Lvl 200"],
      datasets: [
        {
          label: label,
          data: values,
          borderColor: themeColor,
          borderWidth: 3,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );
            gradient.addColorStop(0, `rgba(${gradientColor}, 0.45)`); // Increased visibility
            gradient.addColorStop(0.5, `rgba(${gradientColor}, 0.15)`);
            gradient.addColorStop(1, `rgba(${gradientColor}, 0.05)`);
            return gradient;
          },
          fill: true,
          tension: 0.45,
          pointRadius: 5, // Brought back circle markers
          pointBackgroundColor: "#fff",
          pointBorderColor: themeColor,
          pointBorderWidth: 2.5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: themeColor,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200, // Slightly longer for more impact
        easing: "easeOutQuart",
        delay: 50, // Minimal delay to ensure clean start
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: { size: 0 },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: () => "",
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(2)}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(0,0,0,0.02)", drawBorder: false },
          ticks: {
            font: { family: "Outfit", size: 10, weight: "600" },
            callback: (v) => v + "%",
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Outfit", size: 10, weight: "600" } },
        },
      },
    },
  });
}

function renderAdDepthChart(values) {
  const ctx = document.getElementById("adDepthChart").getContext("2d");
  const tableContainer = document.getElementById("ad-depth-table-container");
  const infoContent = document.getElementById("ads-info-content");
  infoContent.innerHTML = `
    <p class="text-emerald-400 font-black uppercase tracking-widest text-[9px] mb-2">Ad Depth Reach</p>
    <p class="text-slate-300">Shows the % of active users who hit specific ad milestones. Use this to find your "power watchers" and check if ads are balanced.</p>`;
  const labels = ["10 Ads", "20 Ads", "40 Ads", "70 Ads", "100 Ads"];

  // 1. Injected Table first to ensure the flexbox layout is final before drawing the chart
  tableContainer.innerHTML = `
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-slate-100">
          <th class="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Milestone</th>
          <th class="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">User Reach %</th>
        </tr>
      </thead>
      <tbody>
        ${labels
          .map(
            (label, i) => `
          <tr class="group hover:bg-emerald-50/50 transition-colors ad-table-row" style="animation-delay: ${200 + i * 80}ms">
            <td class="px-4 py-3 text-xs font-bold text-slate-600">${label}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-slate-800">${values[i].toFixed(2)}%</span>
                <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                  <div class="h-full bg-emerald-500 rounded-full" style="width: ${values[i]}%"></div>
                </div>
              </div>
            </td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;

  // 2. Initialize Chart with corrected staggered animation delay
  if (charts.ads) charts.ads.destroy();
  charts.ads = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          hoverBackgroundColor: "#10b981",
          borderRadius: 10,
          barThickness: 45,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
        // dataIndex is the correct property for staggered bar animations in Chart.js
        delay: (context) => context.dataIndex * 150,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: { size: 0 },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: () => "",
            label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(2)}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.02)" },
          ticks: {
            font: { size: 10, weight: "bold" },
            callback: (v) => v + "%",
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10, weight: "bold" } },
        },
      },
    },
  });
}

function togglePerformanceMode(mode) {
  performanceMode = mode;
  const impactBtn = document.getElementById("btn-perf-impact");
  const efficiencyBtn = document.getElementById("btn-perf-efficiency");

  if (mode === "impact") {
    impactBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600";
    efficiencyBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700";
  } else {
    efficiencyBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all bg-white shadow-sm text-blue-600";
    impactBtn.className =
      "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-slate-500 hover:text-slate-700";
  }
  renderFrictionChart();
}

function renderFrictionChart() {
  if (!lastData) return;
  const ctx = document.getElementById("frictionChart").getContext("2d");
  const infoContent = document.getElementById("perf-info-content");
  const legendContainer = document.getElementById("perf-legend-container");
  const reach = lastData.slice(14, 20);
  const gaps = [20, 30, 20, 30, 50, 50];

  // 1. Friction Drop (Raw User Loss)
  const frictionDrop = [
    reach[0],
    ((reach[0] - reach[1]) / reach[0]) * 100,
    ((reach[1] - reach[2]) / reach[1]) * 100,
    ((reach[2] - reach[3]) / reach[2]) * 100,
    ((reach[3] - reach[4]) / reach[3]) * 100,
    ((reach[4] - reach[5]) / reach[4]) * 100,
  ];

  // 2. Efficiency (Performance Index)
  const piData = frictionDrop.map((val, i) => Math.pow(val / 100, 1 / gaps[i]));

  if (charts.friction) charts.friction.destroy();

  let chartData, barColors, tooltipLabel, yAxisLabel, showLine;

  if (performanceMode === "impact") {
    chartData = frictionDrop;
    // Red Gradient style for Impact
    const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
    redGradient.addColorStop(0, "#f87171");
    redGradient.addColorStop(1, "#ef4444");
    barColors = redGradient;
    tooltipLabel = "Friction Drop";
    yAxisLabel = (v) => v + "%";
    showLine = true;

    infoContent.innerHTML = `
      <p class="text-blue-400 font-black uppercase tracking-widest text-[9px] mb-2">Friction Drop</p>
      <p class="text-slate-300">Shows exactly where the highest number of players are leaving the game.</p>`;
    legendContainer.innerHTML = ""; // No legend needed for uniform view
  } else {
    chartData = piData;
    // 6 Hex Hardcoded Scale for Efficiency
    const rankedIndices = piData
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val)
      .map((item) => item.idx);
    const colorMap = {
      0: "#63be7b",
      1: "#a8dab7",
      2: "#afb6bb",
      3: "#dfe8ee",
      4: "#facfd2",
      5: "#f8696b",
    };
    barColors = new Array(6);
    rankedIndices.forEach((originalIdx, rank) => {
      barColors[originalIdx] = colorMap[rank];
    });

    tooltipLabel = "Efficiency Index";
    yAxisLabel = (v) => v.toFixed(3);
    showLine = false;

    infoContent.innerHTML = `
      <p class="text-emerald-400 font-black uppercase tracking-widest text-[9px] mb-2">Group Performance</p>
      <p class="text-slate-300">Highlights which level groups are actually the most difficult for players, regardless of how many levels are in the group.</p>`;
    legendContainer.innerHTML = `
      <div class="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4">
        <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#63be7b]"></div> Best</div>
        <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#afb6bb]"></div> Moderate</div>
        <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#f8696b]"></div> Worst</div>
      </div>`;
  }

  charts.friction = new Chart(ctx, {
    data: {
      labels: [
        "Onboard-Lvl 20",
        "Lvl 20-50",
        "Lvl 50-70",
        "Lvl 70-100",
        "Lvl 100-150",
        "Lvl 150-200",
      ],
      datasets: [
        {
          type: "line",
          data: showLine ? chartData : [],
          borderColor: "#262626",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
          order: 1,
        },
        {
          type: "bar",
          data: chartData,
          backgroundColor: barColors,
          borderRadius: 8,
          barThickness: 55,
          order: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
        delay: (context) => context.dataIndex * 100, // Staggered "rising" effect for bars
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          displayColors: false,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: { size: 0 },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: () => "",
            label: (ctx) =>
              `${tooltipLabel}: ${performanceMode === "impact" ? ctx.raw.toFixed(2) + "%" : ctx.raw.toFixed(3)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: performanceMode === "impact",
          min: performanceMode === "efficiency" ? 0.9 : undefined, // Zoom in for PI to show differences
          grid: { color: "rgba(0,0,0,0.02)" },
          ticks: {
            font: { family: "Outfit", weight: "600" },
            callback: yAxisLabel,
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Outfit", weight: "700", size: 11 } },
        },
      },
    },
  });
}

function saveToDatabase() {
  document.getElementById("confirm-modal").classList.remove("hidden");
}

function executeDummyPush(event) {
  const btn = event.target;
  btn.innerText = "Pushing...";
  btn.disabled = true;

  // Capture selection for the success message
  const g = baseSelection.game || "Unknown Game";
  const v = baseSelection.version || "N/A";
  const d = baseSelection.day || "D0";

  setTimeout(() => {
    document.getElementById("confirm-modal").classList.add("hidden");
    const successModal = document.getElementById("success-modal");
    const details = document.getElementById("success-details");

    // Formats the detail pill to: "Detective IQ 3 | v56 | Day 0"
    const dayLabel = d === "D0" ? "Day 0" : d === "D7" ? "Day 7" : "Day 30";
    details.innerText = `${g.replace(/\s*ios\s*$/i, "")} | v${v} | ${dayLabel}`;
    successModal.classList.remove("hidden");

    btn.innerText = "Confirm";
    btn.disabled = false;
  }, 1200);
}

function validateInjection() {
  const data = document.getElementById("inject-textarea").value.trim();
  const btn = document.getElementById("inject-btn");
  // Tooltip visibility is now handled by CSS :has(button[disabled]) for consistency
  if (
    activeInjection.game &&
    activeInjection.version &&
    activeInjection.day &&
    data
  ) {
    btn.disabled = false;
    btn.classList.replace("bg-slate-200", "bg-slate-900");
    btn.classList.replace("text-slate-400", "text-white");
  } else {
    btn.disabled = true;
    btn.classList.replace("bg-slate-900", "bg-slate-200");
    btn.classList.replace("text-white", "text-slate-400");
  }
}

window.onload = () => {
  syncAllDropdowns();
  initNavSwitcher();
  document
    .getElementById("inject-textarea")
    .addEventListener("input", validateInjection);
};

function initNavSwitcher() {
  const list = document.getElementById("nav-game-list");
  list.innerHTML = Object.keys(STUDIO_GAMES)
    .map((key) => {
      const data = STUDIO_GAMES[key];
      const isSelected = baseSelection.game === key;
      const platformIcon = data.platforms.includes("android")
        ? "android"
        : "apple";
      return `
      <div class="nav-item ${isSelected ? "selected" : ""}" data-search="${key.toLowerCase()}" onclick="pickOption('GAME', '${key}', 'base'); toggleDropdown('nav-dropdown');">
        <img src="${data.icon}" alt="${key}" />
        <p>${data.shortName || key}</p>
        <div class="platform-icon-wrap"><i class="fab fa-${platformIcon} ${platformIcon === "android" ? "text-emerald-500" : "text-slate-400"} text-[10px]"></i></div>
      </div>`;
    })
    .join("");
}

function filterNavGames() {
  const query = document.getElementById("nav-search").value.toLowerCase();
  const items = document.querySelectorAll("#nav-game-list .nav-item");
  items.forEach((item) => {
    const searchContext = item.getAttribute("data-search");
    const displayContext = item.querySelector("p").innerText.toLowerCase();
    const isMatch =
      searchContext.includes(query) || displayContext.includes(query);
    item.style.display = isMatch ? "flex" : "none";
  });
}
function filterSlotGames(index) {
  const container = document.getElementById(`sd-g-${index}`);
  const query = container.querySelector("input").value.toLowerCase();
  const items = container.querySelectorAll(".nav-item");
  items.forEach((item) => {
    const searchContext = item.getAttribute("data-search");
    const displayContext = item.querySelector("p").innerText.toLowerCase();
    const isMatch =
      searchContext.includes(query) || displayContext.includes(query);
    item.style.display = isMatch ? "flex" : "none";
  });
}

function toggleDropdown(id) {
  // Close other open dropdowns first
  document.querySelectorAll(".dropdown-content").forEach((d) => {
    if (d.id !== id) d.classList.add("hidden");
  });

  const dropdown = document.getElementById(id);
  dropdown.classList.toggle("hidden");

  if (id === "nav-dropdown" && !dropdown.classList.contains("hidden")) {
    document.getElementById("nav-search").focus();
  }
}

function initVersionSwitcher(gameName) {
  const list = document.getElementById("nav-version-list");
  const versions = [...(metadata.versions[gameName] || [])].reverse(); // Show latest first
  const btn = document.getElementById("btn-base-version");

  if (btn) btn.disabled = versions.length === 0;

  if (versions.length === 0) {
    list.innerHTML =
      '<p class="text-[10px] text-slate-400 text-center py-4">No versions added</p>';
    document.getElementById("nav-current-version").innerText = "None Selected";
    return;
  }

  list.innerHTML = versions
    .map(
      (v) => `
    <button class="list-item text-xs" data-search="${v}" onclick="pickOption('VERSION', '${v}', 'base'); toggleDropdown('nav-version-dropdown');">${v}</button>
  `,
    )
    .join("");
}

function filterNavVersions() {
  const query = document
    .getElementById("nav-version-search")
    .value.toLowerCase();
  const items = document.querySelectorAll("#nav-version-list .list-item");
  items.forEach((item) => {
    const searchContext = item.getAttribute("data-search");
    item.style.display = searchContext.includes(query) ? "flex" : "none";
  });
}

function filterSlotVersions(index) {
  const query = document.getElementById(`slot-v-search-${index}`).value;
  updateSlotVersionUI(index, query);
}

function syncNavSwitcher(gameName) {
  const data = STUDIO_GAMES[gameName];
  if (!data) return;

  const iconImg = document.getElementById("nav-current-icon");
  const nameSpan = document.getElementById("nav-current-game");

  iconImg.src = data.icon;
  iconImg.classList.remove("hidden");
  nameSpan.innerText = data.shortName || gameName.replace(/\s*ios\s*$/i, "");

  // Update Version dropdown for this game
  initVersionSwitcher(gameName);
}

window.addEventListener("click", (e) => {
  const target = e.target;

  // 1. Close Modals on Backdrop Click
  if (
    target.id &&
    target.id.endsWith("-modal") &&
    target.classList.contains("fixed")
  ) {
    target.classList.add("hidden");
  }

  // 2. Close Dropdowns on Outside Click
  if (
    !target.closest(".group") &&
    !target.closest(".dropdown-content") &&
    !target.closest(".slot-dropdown")
  ) {
    document
      .querySelectorAll(".dropdown-content, .slot-dropdown")
      .forEach((d) => d.classList.add("hidden"));
  }
});
