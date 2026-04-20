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
let lastCompLayers = null;
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
        if (tabId === "ads") renderAdDepthChart();
        if (tabId === "performance") renderFrictionChart();
        if (tabId === "dataset") renderDatasetTable();
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

function updateCompareHeader(activeSlots) {
  const header = document.getElementById("compare-header");
  if (!header) return;

  const slotLetters = ["A", "B", "C", "D"];

  header.innerHTML = activeSlots
    .map((s, i) => {
      const data = STUDIO_GAMES[s.game];
      const icon = data ? data.icon : "https://via.placeholder.com/32";
      const fullName = s.game.replace(/\s*ios\s*$/i, "");
      const formattedDay = s.day.replace("D", "Day ");
      const crownHTML =
        i === 0
          ? `<i class="fas fa-crown absolute -top-5 -left-3 text-amber-400 text-xl drop-shadow-md -rotate-12 z-10"></i>`
          : "";

      return `
      <div class="flex-1 flex items-center gap-3 px-4 first:pl-0 min-w-0">
        <span class="text-4xl font-black text-slate-900 pr-4 border-r border-slate-200 leading-none">${slotLetters[i]}</span>
        <div class="relative shrink-0 ml-1">
          ${crownHTML}
          <img src="${icon}" class="w-12 h-12 rounded-xl object-cover shadow-sm border border-slate-100 relative z-0" />
        </div>
        <div class="flex flex-col items-start min-w-0 w-full justify-center">
          <span class="text-sm font-black text-slate-800 leading-none mb-1.5 truncate w-full">${fullName}</span>
          <div class="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 tracking-widest shrink-0">
            <span class="bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 normal-case">v${s.version}</span>
            <span class="bg-slate-100/80 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 uppercase">${formattedDay}</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  header.className =
    "mb-10 pb-6 border-b border-slate-100 flex w-full items-center justify-between";
}

function refreshDashboard() {
  const gameHeader = document.getElementById("game-header");
  const compareHeader = document.getElementById("compare-header");

  if (dashboardMode === "single") {
    compareHeader?.classList.add("hidden");
    compareHeader?.classList.remove("flex");

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

    if (activeSlots.length > 0) updateCompareHeader(activeSlots);

    if (activeSlots.length < 2) return;

    const datasets = activeSlots
      .map((s) => ({
        meta: s,
        data: MOCK_DATABASE[`${s.game}_${s.version}_${s.day}`],
      }))
      .filter((item) => item.data);

    if (datasets.length >= 2) {
      updateDashboardUI(datasets[0].data, datasets.slice(1));
    } else if (datasets.length === 1) {
      updateDashboardUI(datasets[0].data);
    }
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
function getLayerLabel(index) {
  if (dashboardMode !== "compare")
    return `LAYER ${["A", "B", "C", "D"][index]}`;
  const activeSlots = selectionSlots.filter((s) => s.game && s.version);
  if (index >= activeSlots.length)
    return `LAYER ${["A", "B", "C", "D"][index]}`;
  const slot = activeSlots[index];
  const shortName = (
    STUDIO_GAMES[slot.game]?.shortName ||
    slot.game.replace(/\s*ios\s*$/i, "").substring(0, 6)
  ).toUpperCase();
  return `${shortName} (v${slot.version} , ${slot.day})`;
}
const generateCard = (c, i, customId = "") => `
  <div ${customId ? `id="${customId}"` : ""} class="premium-card p-7 group" style="--card-color: ${tailwindColors[c.color].hex}; --card-tint: ${tailwindColors[c.color].glass}; animation-delay: ${i * 80}ms">
    <div class="card-content-wrapper transition-all duration-200">
      <div class="flex justify-between items-center mb-10">
        <div class="card-icon-container w-14 h-14 bg-white text-${c.color}-600 rounded-2xl text-xl shadow-sm border border-slate-50">
          ${c.icon.startsWith("<") ? c.icon : `<i class="fas ${c.icon}"></i>`}
        </div>
        <div class="flex flex-col items-end">
           <span class="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Data Source</span>
           <div class="flex items-center gap-1.5 mt-1">
             <div class="pulse-dot w-1.5 h-1.5 rounded-full bg-${c.color}-500 animate-pulse"></div>
             <span class="synced-text text-[8px] font-bold text-${c.color}-600 uppercase">Synced</span>
           </div>
        </div>
      </div>
      <p class="card-label text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2 group-hover:text-slate-600 transition-colors">${c.label}</p>
      <div class="flex items-baseline">
        <h3 class="card-value text-4xl font-extrabold text-slate-800 tracking-tighter">${c.val}</h3>
      </div>
    </div>
  </div>`;

const formatCValue = (val, idx) => {
  if (idx === 0) return val.toLocaleString();
  if (
    idx === 27 ||
    idx === 20 ||
    idx === 23 ||
    idx === 24 ||
    idx === 25 ||
    idx === 26
  )
    return val.toFixed(2) + "%";
  if (idx === 12) return val.toFixed(2);
  if (idx === 22 || idx === 21) return formatTime(val);
  return val;
};

const generateOverviewCard = (c, i, compLayers, customId = "") => {
  if (dashboardMode === "single" || !compLayers || compLayers.length === 0) {
    return generateCard(c, i, customId);
  }

  const baseRaw = c.rawVal;
  const slotLetters = ["B", "C", "D"];

  const rowsHTML = compLayers
    .map((layer, idx) => {
      const compRaw = layer.data[c.index];
      const compValStr = formatCValue(compRaw, c.index);
      const isAbs = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 23, 24,
        25, 26, 27,
      ].includes(c.index);
      let delta = 0;
      let deltaStr = "";

      if (isAbs) {
        delta = compRaw - baseRaw;
        deltaStr =
          delta > 0 ? `+${delta.toFixed(2)}pp` : `${delta.toFixed(2)}pp`;
      } else {
        delta =
          baseRaw === 0
            ? compRaw > 0
              ? 100
              : 0
            : ((compRaw - baseRaw) / baseRaw) * 100;
        deltaStr = delta > 0 ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`;
      }

      let isPositive = c.invertDelta ? delta <= 0 : delta >= 0;

      const dColorStyle = isPositive
        ? "bg-emerald-500 text-white border border-emerald-600"
        : "bg-rose-500 text-white border border-rose-600";

      return `
                    <div class="py-2.5 border-b border-slate-200/50 last:border-0 last:pb-0 first:pt-0 flex flex-col justify-center">
                      <span class="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5 leading-[1.1]">${getLayerLabel(idx + 1)}</span>
              <div class="flex items-center justify-between gap-3">
                <span class="text-[24px] font-black text-slate-800 tabular-nums leading-none tracking-tight">${compValStr}</span>
                <span class="px-3 py-1 rounded-full text-[13px] font-black ${dColorStyle} shadow-sm whitespace-nowrap tracking-tight leading-none">${deltaStr}</span>
              </div>
            </div>`;
    })
    .join("");

  return `
        <div ${customId ? `id="${customId}"` : ""} class="premium-card p-5 group flex flex-col justify-between" style="--card-color: ${tailwindColors[c.color].hex}; --card-tint: ${tailwindColors[c.color].glass}; animation-delay: ${i * 80}ms">
          <div class="flex items-center justify-between mb-4">
             <div class="flex items-center gap-3">
                 <div class="overview-icon-container w-11 h-11 rounded-[12px] bg-white text-${c.color}-500 flex items-center justify-center text-lg shadow-sm border border-slate-100">
                     ${c.icon.startsWith("<") ? c.icon : `<i class="fas ${c.icon}"></i>`}
                 </div>
                 <h4 class="text-[14px] font-black text-slate-800 uppercase tracking-widest leading-none">${c.label}</h4>
             </div>
             <div class="flex items-center gap-1.5">
                 <div class="w-1.5 h-1.5 rounded-full bg-${c.color}-500 animate-pulse"></div>
                 <span class="text-[9px] font-bold text-${c.color}-600 uppercase tracking-widest">Synced</span>
             </div>
          </div>

          <div class="flex flex-row items-stretch h-full gap-5 mt-1">
             <div class="flex-1 flex flex-col justify-center">
                 <p class="text-[10px] font-bold tracking-widest text-slate-400 mb-2 leading-[1.1]">${getLayerLabel(0)}</p>
                 <h3 class="text-[40px] font-black text-${c.color}-500 tracking-tighter drop-shadow-sm leading-none">${c.val}</h3>
             </div>
             
             <div class="w-px bg-slate-200/80 my-2"></div>
             
             <div class="flex-[1.2] flex flex-col justify-center min-w-[150px]">
                ${rowsHTML}
             </div>
          </div>
        </div>`;
};

function updateDashboardUI(data, compLayers = null) {
  lastData = data;
  lastCompLayers = compLayers;

  // Reconstruct Tab Layouts from placeholders to active containers
  document.getElementById("view-overview").className =
    "tab-view hidden space-y-8";
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
            <button onclick="toggleRetentionMode('install')" id="btn-ret-install" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${retentionChartMode === "install" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}">Vs Install</button>
            <button onclick="toggleRetentionMode('onboard')" id="btn-ret-onboard" class="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${retentionChartMode === "onboard" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}">Vs Onboarded</button>
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

  document.getElementById("view-dataset").className = "tab-view hidden";
  document.getElementById("view-dataset").innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2">
          <div>
            <h4 class="text-2xl font-black text-slate-900 tracking-tight">Consolidated Dataset</h4>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Categorized Metric Ledger</p>
          </div>
        </div>
        <div id="dataset-container" class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"></div>`;
  const overviewContainer = document.getElementById("kpi-cards-container");
  const retentionContainer = document.getElementById(
    "retention-cards-container",
  );

  const overviewCards = [
    {
      label: "Total Installs",
      val: data[0].toLocaleString(),
      rawVal: data[0],
      index: 0,
      icon: "fa-download",
      color: "blue",
    },
    {
      label: "ROAS",
      val: data[27].toFixed(2) + "%",
      rawVal: data[27],
      index: 27,
      icon: "fa-hand-holding-dollar",
      color: "orange",
    },
    {
      label: "Avg Ad per User",
      val: data[12].toFixed(2),
      rawVal: data[12],
      index: 12,
      icon: "fa-video relative ad-text-icon",
      color: "emerald",
    },
    {
      label: "Install to Onboard %",
      val: data[20].toFixed(2) + "%",
      rawVal: data[20],
      index: 20,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.25em; height: 1.25em;"><path d="M4.5 3.5C3.5 3.5 2.5 4.3 2.5 5.3v13.4c0 1 1 1.8 2 1.8l7.5 1.7c.8.2 1.5-.4 1.5-1.2V3c0-.8-.7-1.4-1.5-1.2L4.5 3.5z"/><circle cx="9.5" cy="12" r="1.3" fill="white"/><path d="M23.5 10.5h-5.5v-2.5l-4 4 4 4v-2.5h5.5v-3z"/><path d="M15 2v2h4c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-4v2h4c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3h-4z"/></svg>`,
      color: "violet",
    },
    {
      label: "Day 1 Retention",
      val: data[23].toFixed(2) + "%",
      rawVal: data[23],
      index: 23,
      icon: "fa-calendar relative d1-text-icon",
      color: "indigo",
    },
    {
      label: "Avg Playtime",
      val: formatTime(data[22]),
      rawVal: data[22],
      index: 22,
      icon: "fa-bolt",
      color: "rose",
    },
  ];

  const isInstall = retentionChartMode === "install";
  const retentionCards = [
    isInstall
      ? {
          label: "Total Installs",
          val: data[0].toLocaleString(),
          rawVal: data[0],
          index: 0,
          icon: "fa-download",
          color: "blue",
        }
      : {
          label: "Onboarded Users",
          val: data[13].toLocaleString(),
          rawVal: data[13],
          index: 13,
          icon: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.25em; height: 1.25em;"><path d="M4.5 3.5C3.5 3.5 2.5 4.3 2.5 5.3v13.4c0 1 1 1.8 2 1.8l7.5 1.7c.8.2 1.5-.4 1.5-1.2V3c0-.8-.7-1.4-1.5-1.2L4.5 3.5z"/><circle cx="9.5" cy="12" r="1.3" fill="white"/><path d="M23.5 10.5h-5.5v-2.5l-4 4 4 4v-2.5h5.5v-3z"/><path d="M15 2v2h4c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-4v2h4c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3h-4z"/></svg>`,
          color: "violet",
        },
    {
      label: "Day 1 Retention",
      val: data[23].toFixed(2) + "%",
      rawVal: data[23],
      index: 23,
      icon: "fa-calendar relative d1-text-icon",
      color: "indigo",
    },
    {
      label: "Day 3 Retention",
      val: data[24].toFixed(2) + "%",
      rawVal: data[24],
      index: 24,
      icon: "fa-calendar relative d3-text-icon",
      color: "blue",
    },
  ];

  const adCards = [
    {
      label: "ROAS",
      val: data[27].toFixed(2) + "%",
      rawVal: data[27],
      index: 27,
      icon: "fa-hand-holding-dollar",
      color: "orange",
    },
    {
      label: "Avg Ad per User",
      val: data[12].toFixed(2),
      rawVal: data[12],
      index: 12,
      icon: "fa-video relative ad-text-icon",
      color: "emerald",
    },
    {
      label: "User Ad Failure Rate",
      val: data[25].toFixed(2) + "%",
      rawVal: data[25],
      index: 25,
      icon: "fa-user-slash",
      color: "rose",
      invertDelta: true,
    },
    {
      label: "Ad Request Failure %",
      val: data[26].toFixed(2) + "%",
      rawVal: data[26],
      index: 26,
      icon: "fa-video-slash relative ad-text-icon",
      color: "orange",
      invertDelta: true,
    },
  ];

  const performanceCards = [
    {
      label: "Onboarded Users",
      val: data[13].toLocaleString(),
      rawVal: data[13],
      index: 13,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.25em; height: 1.25em;"><path d="M4.5 3.5C3.5 3.5 2.5 4.3 2.5 5.3v13.4c0 1 1 1.8 2 1.8l7.5 1.7c.8.2 1.5-.4 1.5-1.2V3c0-.8-.7-1.4-1.5-1.2L4.5 3.5z"/><circle cx="9.5" cy="12" r="1.3" fill="white"/><path d="M23.5 10.5h-5.5v-2.5l-4 4 4 4v-2.5h5.5v-3z"/><path d="M15 2v2h4c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-4v2h4c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3h-4z"/></svg>`,
      color: "violet",
    },
    {
      label: "Avg. Session Length",
      val: formatTime(data[21]),
      rawVal: data[21],
      index: 21,
      icon: "fa-clock",
      color: "blue",
    },
    {
      label: "Avg. Playtime",
      val: formatTime(data[22]),
      rawVal: data[22],
      index: 22,
      icon: "fa-bolt",
      color: "rose",
    },
  ];
  overviewContainer.innerHTML = overviewCards
    .map((c, i) => generateOverviewCard(c, i, compLayers))
    .join("");
  retentionContainer.innerHTML = retentionCards
    .map((c, i) =>
      generateOverviewCard(c, i, compLayers, i === 0 ? "dynamic-ret-card" : ""),
    )
    .join("");
  document.getElementById("ad-cards-container").innerHTML = adCards
    .map((c, i) => generateOverviewCard(c, i, compLayers))
    .join("");
  document.getElementById("performance-cards-container").innerHTML =
    performanceCards
      .map((c, i) => generateOverviewCard(c, i, compLayers))
      .join("");

  const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
  switchTab(activeTab);
}

function renderDatasetTable() {
  if (!lastData) return;
  const container = document.getElementById("dataset-container");
  if (!container) return;

  const formatNum = (val) => val.toLocaleString();
  const formatPct = (val) => val.toFixed(2) + "%";
  const formatDec = (val) => val.toFixed(2);

  const tailwindColors = {
    blue: { hex: "#3b82f6", glass: "rgba(59, 130, 246, 0.08)" },
    violet: { hex: "#8b5cf6", glass: "rgba(139, 92, 246, 0.08)" },
    emerald: { hex: "#10b981", glass: "rgba(16, 185, 129, 0.08)" },
    rose: { hex: "#f43f5e", glass: "rgba(244, 63, 94, 0.08)" },
    orange: { hex: "#f97316", glass: "rgba(249, 115, 22, 0.08)" },
  };

  const categories = [
    {
      title: "Core Funnel",
      icon: "fa-rocket",
      color: "blue",
      metrics: [
        { label: "Total Installs", idx: 0, fmt: formatNum },
        { label: "Install to Onboard %", idx: 20, fmt: formatPct },
      ],
    },
    {
      title: "Level Progression",
      icon: "fa-arrow-down-wide-short",
      color: "violet",
      metrics: [
        { label: "Lvl 20 Reach %", idx: 1, fmt: formatPct },
        { label: "Lvl 50 Reach %", idx: 2, fmt: formatPct },
        { label: "Lvl 70 Reach %", idx: 3, fmt: formatPct },
        { label: "Lvl 100 Reach %", idx: 4, fmt: formatPct },
        { label: "Lvl 150 Reach %", idx: 5, fmt: formatPct },
        { label: "Lvl 200 Reach %", idx: 6, fmt: formatPct },
      ],
    },
    {
      title: "Monetization Systems (IS+RV)",
      icon: "fa-video relative ad-text-icon",
      color: "emerald",
      metrics: [
        { label: "Ads 10 Reach %", idx: 7, fmt: formatPct },
        { label: "Ads 20 Reach %", idx: 8, fmt: formatPct },
        { label: "Ads 40 Reach %", idx: 9, fmt: formatPct },
        { label: "Ads 70 Reach %", idx: 10, fmt: formatPct },
        { label: "Ads 100 Reach %", idx: 11, fmt: formatPct },
        { label: "Avg Ad per user", idx: 12, fmt: formatDec },
        {
          label: "User Ad Failure Rate",
          idx: 25,
          fmt: formatPct,
          invert: true,
        },
        {
          label: "Ad Request Failure %",
          idx: 26,
          fmt: formatPct,
          invert: true,
        },
      ],
    },
    {
      title: "Engagement & Quality",
      icon: "fa-heart",
      color: "rose",
      metrics: [
        { label: "Avg. Session Length", idx: 21, fmt: formatTime },
        { label: "Avg. Playtime", idx: 22, fmt: formatTime },
        { label: "Day 1 Retention", idx: 23, fmt: formatPct },
        { label: "Day 3 Retention", idx: 24, fmt: formatPct },
      ],
    },
    {
      title: "Revenue Health",
      icon: "fa-hand-holding-dollar",
      color: "orange",
      metrics: [{ label: "ROAS", idx: 27, fmt: formatPct }],
    },
  ];

  const isCompare =
    dashboardMode === "compare" && lastCompLayers && lastCompLayers.length > 0;
  const slotLetters = ["B", "C", "D"];

  container.className = "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6";

  container.innerHTML = categories
    .map((cat, i) => {
      let headersHTML = "";
      if (isCompare) {
        headersHTML = `
            <div class="flex justify-between items-center px-2 py-2 border-b border-slate-200/80 mb-2 bg-slate-50 rounded-t-lg">
              <span class="w-[30%] text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">KPI</span>
              <div class="flex-1 flex items-center">
                <span class="flex-1 text-center text-[9px] font-black text-slate-400 tracking-widest leading-[1.1]">${getLayerLabel(0)}</span>
                      ${lastCompLayers.map((_, idx) => `<span class="flex-1 text-center text-[9px] font-black text-slate-400 tracking-widest border-l border-slate-200/60 leading-[1.1]">${getLayerLabel(idx + 1)}</span>`).join("")}
              </div>
            </div>
          `;
      }

      const metricsHTML = cat.metrics
        .map((m, mIdx) => {
          const baseRaw = lastData[m.idx];
          const baseFormatted = m.fmt(baseRaw);

          if (!isCompare) {
            return `
              <div class="flex justify-between items-center px-2 py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group animate-slide-up" style="animation-fill-mode: both; animation-delay: ${150 + mIdx * 60}ms">
                <span class="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">${m.label}</span>
                <span class="text-[12px] font-black text-slate-800 tabular-nums bg-white border border-slate-200/80 shadow-sm px-2.5 py-1 rounded-md transition-colors">${baseFormatted}</span>
              </div>
            `;
          } else {
            let compValsHTML = lastCompLayers
              .map((layer) => {
                const compRaw = layer.data[m.idx];
                const compVal = m.fmt(compRaw);

                const isAbs = [
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20,
                  23, 24, 25, 26, 27,
                ].includes(m.idx);
                let delta = 0;
                let deltaStr = "";

                if (isAbs) {
                  delta = compRaw - baseRaw;
                  deltaStr =
                    delta > 0
                      ? `+${delta.toFixed(2)}pp`
                      : `${delta.toFixed(2)}pp`;
                } else {
                  if (baseRaw !== 0) {
                    delta = ((compRaw - baseRaw) / baseRaw) * 100;
                  } else if (compRaw > 0) {
                    delta = 100;
                  }
                  deltaStr =
                    delta > 0
                      ? `+${delta.toFixed(2)}%`
                      : `${delta.toFixed(2)}%`;
                }

                let isPositive = m.invert ? delta <= 0 : delta >= 0;

                const pillClass = isPositive ? "bg-emerald-500" : "bg-rose-500";
                const arrowClass = isPositive
                  ? "border-t-emerald-500"
                  : "border-t-rose-500";

                return `
                <div class="flex-1 flex justify-center items-center px-1 border-l border-slate-200/60">
                  <div class="relative w-full max-w-[80px] h-[32px] flex justify-center items-center rounded-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-inner hover:scale-95 cursor-default group/cell">
                    <span class="text-[11px] font-bold text-slate-700 group-hover/cell:text-slate-900 group-hover/cell:font-black transition-all tabular-nums">${compVal}</span>
                    
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover/cell:opacity-100 transition-all duration-200 pointer-events-none z-[100] transform translate-y-2 group-hover/cell:translate-y-0 flex flex-col items-center drop-shadow-lg">
                       <div class="px-3 py-1.5 rounded-xl text-[12px] font-black text-white ${pillClass} whitespace-nowrap tracking-tight leading-none shadow-sm">${deltaStr}</div>
                       <div class="w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] ${arrowClass} -mt-[0.5px]"></div>
                    </div>
                  </div>
                </div>
              `;
              })
              .join("");

            return `
              <div class="flex justify-between items-center px-2 py-1.5 border-b border-slate-100/50 last:border-0 hover:bg-slate-50 transition-colors group animate-slide-up" style="animation-fill-mode: both; animation-delay: ${150 + mIdx * 60}ms">
                <span class="w-[30%] text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors truncate pr-2">${m.label}</span>
                <div class="flex-1 flex items-center">
                  <div class="flex-1 flex justify-center items-center px-1">
                    <div class="relative w-full max-w-[80px] h-[32px] flex justify-center items-center rounded-lg border border-transparent transition-all duration-200 group-hover:bg-white group-hover:border-slate-200/80 group-hover:shadow-sm">
                      <span class="text-[11px] font-black text-slate-800 tabular-nums">${baseFormatted}</span>
                    </div>
                  </div>
                  ${compValsHTML}
                </div>
              </div>
            `;
          }
        })
        .join("");

      return `
      <div class="premium-card p-6 break-inside-avoid mb-6" style="--card-color: ${tailwindColors[cat.color].hex}; --card-tint: ${tailwindColors[cat.color].glass}; animation: slideUpRow 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; animation-delay: ${i * 80}ms; opacity: 0;">
        <div class="flex items-center gap-4 mb-5 pb-4 border-b border-slate-100/50">
          <div class="dataset-icon-container w-10 h-10 rounded-[10px] bg-white border border-slate-100 shadow-sm flex items-center justify-center" style="color: var(--card-color)">
            ${cat.icon.startsWith("<") ? cat.icon : `<i class="fas ${cat.icon} text-base"></i>`}
          </div>
          <h5 class="text-[11px] font-black text-slate-800 uppercase tracking-[0.15em]">${cat.title}</h5>
        </div>
        ${headersHTML}
        <div class="space-y-1">
          ${metricsHTML}
        </div>
      </div>
    `;
    })
    .join("");
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
  updateDynamicRetentionCard();
}

function updateDynamicRetentionCard() {
  const card = document.getElementById("dynamic-ret-card");
  if (!card || !lastData) return;

  const isInstall = retentionChartMode === "install";
  const cData = isInstall
    ? {
        label: "Total Installs",
        val: lastData[0].toLocaleString(),
        rawVal: lastData[0],
        index: 0,
        icon: "fa-download",
        color: "blue",
      }
    : {
        label: "Onboarded Users",
        val: lastData[13].toLocaleString(),
        rawVal: lastData[13],
        index: 13,
        icon: `<svg viewBox="0 0 24 24" fill="currentColor" style="width: 1.25em; height: 1.25em;"><path d="M4.5 3.5C3.5 3.5 2.5 4.3 2.5 5.3v13.4c0 1 1 1.8 2 1.8l7.5 1.7c.8.2 1.5-.4 1.5-1.2V3c0-.8-.7-1.4-1.5-1.2L4.5 3.5z"/><circle cx="9.5" cy="12" r="1.3" fill="white"/><path d="M23.5 10.5h-5.5v-2.5l-4 4 4 4v-2.5h5.5v-3z"/><path d="M15 2v2h4c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1h-4v2h4c1.7 0 3-1.3 3-3V5c0-1.7-1.3-3-3-3h-4z"/></svg>`,
        color: "violet",
      };

  card.style.transition = "opacity 0.2s ease-in-out";
  card.style.opacity = "0";

  setTimeout(() => {
    const newHTML = generateOverviewCard(
      cData,
      0,
      lastCompLayers,
      "dynamic-ret-card",
    );
    card.outerHTML = newHTML;

    const newCard = document.getElementById("dynamic-ret-card");
    if (newCard) {
      newCard.style.animation = "none";
      newCard.style.transform = "translateY(0)"; // Locks hover transform anomaly
      newCard.style.opacity = "0";
      void newCard.offsetWidth; // Trigger reflow
      newCard.style.transition = "opacity 0.3s ease-in-out";
      newCard.style.opacity = "1";

      setTimeout(() => {
        newCard.style.transition = "";
        // Keeping transform inline seamlessly prevents the hover popup
      }, 300);
    }
  }, 200);
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

  const baseValues =
    retentionChartMode === "install"
      ? lastData.slice(1, 7)
      : lastData.slice(14, 20);

  const label =
    retentionChartMode === "install" ? "Reach %" : "Onboard to Lvl %";

  const isCompare =
    dashboardMode === "compare" && lastCompLayers && lastCompLayers.length > 0;
  let datasets = [];

  const layerColors = [
    { hex: "#83A95C", rgb: "131, 169, 92" },
    { hex: "#944E6C", rgb: "148, 78, 108" },
    { hex: "#433D3C", rgb: "67, 61, 60" },
    { hex: "#3b82f6", rgb: "59, 130, 246" },
  ];

  const createGradient = (ctx, chartArea, rgb) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, `rgba(${rgb}, 0.45)`);
    gradient.addColorStop(0.5, `rgba(${rgb}, 0.15)`);
    gradient.addColorStop(1, `rgba(${rgb}, 0.05)`);
    return gradient;
  };

  const addLayerDataset = (dataVals, layerIdx, customLabel = null) => {
    const color = layerColors[layerIdx];
    datasets.push({
      label: customLabel || getLayerLabel(layerIdx),
      data: dataVals,
      borderColor: color.hex,
      borderWidth: 3,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return null;
        return createGradient(ctx, chartArea, color.rgb);
      },
      fill: true,
      tension: 0.45,
      pointRadius: 5,
      pointBackgroundColor: color.hex,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: color.hex,
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2.5,
    });
  };

  if (!isCompare) {
    addLayerDataset(baseValues, 0, label);
  } else {
    addLayerDataset(baseValues, 0);
    lastCompLayers.forEach((layer, idx) => {
      const compValues =
        retentionChartMode === "install"
          ? layer.data.slice(1, 7)
          : layer.data.slice(14, 20);
      addLayerDataset(compValues, idx + 1);
    });
  }

  if (charts.funnel) charts.funnel.destroy();
  charts.funnel = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lvl 20", "Lvl 50", "Lvl 70", "Lvl 100", "Lvl 150", "Lvl 200"],
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
        delay: (context) => context.dataIndex * 50,
      },
      plugins: {
        legend: {
          display: isCompare,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: { family: "Outfit", size: 10, weight: "bold" },
            color: "#64748b",
          },
        },
        tooltip: {
          enabled: true,
          usePointStyle: true,
          boxPadding: 4,
          displayColors: isCompare,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: {
            family: "Outfit",
            size: isCompare ? 11 : 0,
            color: "#94a3b8",
            weight: "bold",
          },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: (ctxs) => (isCompare ? ctxs[0].label : ""),
            label: (ctx) =>
              `${isCompare ? ctx.dataset.label : ctx.label}: ${ctx.raw.toFixed(2)}%`,
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

function renderAdDepthChart() {
  if (!lastData) return;
  const values = lastData.slice(7, 12);
  const ctx = document.getElementById("adDepthChart").getContext("2d");
  const tableContainer = document.getElementById("ad-depth-table-container");
  const infoContent = document.getElementById("ads-info-content");
  infoContent.innerHTML = `
    <p class="text-emerald-400 font-black uppercase tracking-widest text-[9px] mb-2">Ad Depth Reach</p>
    <p class="text-slate-300">Shows the % of active users who hit specific ad milestones. Use this to find our "power watchers" and check if ads are balanced.</p>`;
  const labels = ["10 Ads", "20 Ads", "40 Ads", "70 Ads", "100 Ads"];

  const isCompare =
    dashboardMode === "compare" && lastCompLayers && lastCompLayers.length > 0;

  let tableHTML = "";
  let datasets = [];

  const palette = [
    { bg: "#84B179", hover: "#709c66", text: "text-white" },
    { bg: "#A2CB8B", hover: "#8bb574", text: "text-slate-900" },
    { bg: "#C7EABB", hover: "#b0d6a3", text: "text-slate-900" },
    { bg: "#E8F5BD", hover: "#d1e0a6", text: "text-slate-900" },
  ];

  if (!isCompare) {
    tableHTML = `
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
            <tr class="group hover:bg-slate-50 transition-colors animate-slide-up" style="animation-fill-mode: both; animation-delay: ${150 + i * 80}ms">
              <td class="px-4 py-3 text-xs font-bold text-slate-600">${label}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-black text-slate-800">${values[i].toFixed(2)}%</span>
                  <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[60px]">
                    <div class="h-full rounded-full" style="width: ${values[i]}%; background-color: ${palette[0].bg};"></div>
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

    datasets.push({
      label: "Reach %",
      data: values,
      backgroundColor: palette[0].bg,
      hoverBackgroundColor: palette[0].hover,
      borderRadius: 10,
      barThickness: 45,
      borderWidth: 0,
    });
  } else {
    const headers = [
      "Milestone",
      getLayerLabel(0),
      ...lastCompLayers.map((_, i) => getLayerLabel(i + 1)),
    ];

    let rowsHTML = labels
      .map((label, idx) => {
        const baseVal = values[idx];

        let rowCols = `<td class="px-4 py-3 text-xs font-bold text-slate-500 border-b border-slate-100/50 sticky left-0 bg-white group-hover:bg-slate-50 group-hover:text-slate-900 transition-colors z-10">${label}</td>`;

        rowCols += `<td class="px-2 py-1.5 border-b border-l border-slate-100/50 text-center bg-slate-50/30">
          <div class="relative w-full h-full flex justify-center items-center py-2.5 rounded-xl transition-all duration-200 group-hover:bg-white">
            <span class="text-xs font-black text-slate-800">${baseVal.toFixed(2)}%</span>
          </div>
        </td>`;

        lastCompLayers.forEach((layer, lIdx) => {
          const compVal = layer.data[7 + idx];
          let delta = compVal - baseVal;
          const deltaStr =
            delta > 0 ? `+${delta.toFixed(2)}pp` : `${delta.toFixed(2)}pp`;

          const pillClass = delta >= 0 ? "bg-emerald-500" : "bg-rose-500";
          const arrowClass =
            delta >= 0 ? "border-t-emerald-500" : "border-t-rose-500";

          rowCols += `
          <td class="px-2 py-1.5 border-b border-l border-slate-100/50 min-w-[90px] text-center">
            <div class="relative w-full h-full flex justify-center items-center py-2.5 rounded-xl transition-all duration-200 hover:bg-slate-100 hover:shadow-inner hover:scale-95 cursor-default group/cell">
              <span class="text-xs font-bold text-slate-700 group-hover/cell:text-slate-900 group-hover/cell:font-black transition-all">${compVal.toFixed(2)}%</span>
              
              <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover/cell:opacity-100 transition-all duration-200 pointer-events-none z-[100] transform translate-y-2 group-hover/cell:translate-y-0 flex flex-col items-center drop-shadow-lg">
                 <div class="px-4 py-2 rounded-xl text-[13px] font-black text-white ${pillClass} whitespace-nowrap tracking-tight leading-none shadow-sm">${deltaStr} <span class="font-bold opacity-90 text-[10px] ml-0.5"></span></div>
                 <div class="w-0 h-0 border-x-[8px] border-x-transparent border-t-[8px] ${arrowClass} -mt-[0.5px]"></div>
              </div>
            </div>
          </td>`;
        });

        return `<tr class="animate-slide-up group" style="animation-fill-mode: both; animation-delay: ${150 + idx * 80}ms">${rowCols}</tr>`;
      })
      .join("");

    tableHTML = `
      <div class="overflow-x-auto custom-scrollbar pb-6 rounded-xl pt-12 -mt-12">
        <table class="w-full text-left whitespace-nowrap border-separate border-spacing-0">
          <thead>
            <tr>
              ${headers
                .map((h, i) => {
                  if (i === 0)
                    return `<th class="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/50 sticky left-0 bg-white z-20">${h}</th>`;
                  return `<th class="px-4 py-3 text-[9px] font-black tracking-widest border-b border-l border-slate-100/50 text-center ${palette[i - 1].text}" style="background-color: ${palette[i - 1].bg};">${h}</th>`;
                })
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
    `;

    datasets.push({
      label: getLayerLabel(0),
      data: values,
      backgroundColor: palette[0].bg,
      hoverBackgroundColor: palette[0].hover,
      borderRadius: 6,
      borderWidth: 0,
    });

    lastCompLayers.forEach((layer, i) => {
      datasets.push({
        label: getLayerLabel(i + 1),
        data: layer.data.slice(7, 12),
        backgroundColor: palette[i + 1].bg,
        hoverBackgroundColor: palette[i + 1].hover,
        borderWidth: 0,
        borderRadius: 6,
      });
    });
  }

  tableContainer.innerHTML = tableHTML;

  if (charts.ads) charts.ads.destroy();
  charts.ads = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1200,
        easing: "easeOutQuart",
        delay: (context) => context.dataIndex * 100,
      },
      plugins: {
        legend: {
          display: isCompare,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: { family: "Outfit", size: 10, weight: "bold" },
            color: "#64748b",
          },
        },
        tooltip: {
          enabled: true,
          displayColors: isCompare,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: {
            family: "Outfit",
            size: isCompare ? 11 : 0,
            color: "#94a3b8",
            weight: "bold",
          },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: (ctxs) => (isCompare ? ctxs[0].label : ""),
            label: (ctx) =>
              `${isCompare ? ctx.dataset.label : ctx.label}: ${ctx.raw.toFixed(2)}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.02)" },
          ticks: {
            font: { family: "Outfit", size: 10, weight: "bold" },
            callback: (v) => v + "%",
          },
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Outfit", size: 10, weight: "bold" } },
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

  const labels = [
    "Onboard-Lvl 20",
    "Lvl 20-50",
    "Lvl 50-70",
    "Lvl 70-100",
    "Lvl 100-150",
    "Lvl 150-200",
  ];
  const gaps = [20, 30, 20, 30, 50, 50];

  const isCompare =
    dashboardMode === "compare" && lastCompLayers && lastCompLayers.length > 0;

  const calcData = (rawData) => {
    const reach = rawData.slice(14, 20);
    const frictionDrop = [
      reach[0],
      ((reach[0] - reach[1]) / reach[0]) * 100,
      ((reach[1] - reach[2]) / reach[1]) * 100,
      ((reach[2] - reach[3]) / reach[2]) * 100,
      ((reach[3] - reach[4]) / reach[3]) * 100,
      ((reach[4] - reach[5]) / reach[4]) * 100,
    ];
    const safeFrictionDrop = frictionDrop.map((v) =>
      isNaN(v) || !isFinite(v) ? 0 : v,
    );
    const piData = safeFrictionDrop.map((val, i) =>
      Math.pow(Math.max(0, val) / 100, 1 / gaps[i]),
    );
    return { frictionDrop: safeFrictionDrop, piData };
  };

  const baseCalc = calcData(lastData);
  let datasets = [];
  let tooltipLabel, yAxisLabel;

  const colorMap = {
    0: "#35d05e", // high (max)
    1: "#7ce09a", // high (low)
    2: "#98a6ae", // mid (high)
    3: "#b9d5e6", // mid (low)
    4: "#ffa1a9", // low (low)
    5: "#ff3f42", // low (max)
  };

  const getEfficiencyColors = (piData, layerIndex) => {
    const rankedIndices = piData
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val)
      .map((item) => item.idx);

    let colors = new Array(6);
    const alpha = 1 - layerIndex * 0.15; // Layer variants: 100%, 85%, 70%, 55%

    rankedIndices.forEach((originalIdx, rank) => {
      const hex = colorMap[rank];
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      colors[originalIdx] = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    });
    return colors;
  };

  infoContent.innerHTML =
    performanceMode === "impact"
      ? `<p class="text-rose-400 font-black uppercase tracking-widest text-[9px] mb-2">Friction Drop</p><p class="text-slate-300">Shows exactly where the highest number of players are leaving the game.</p>`
      : `<p class="text-emerald-400 font-black uppercase tracking-widest text-[9px] mb-2">Group Performance</p><p class="text-slate-300">Highlights which level groups are actually the most difficult for players.</p>`;

  legendContainer.innerHTML =
    performanceMode === "efficiency"
      ? `
    <div class="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4">
      <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#35d05e]"></div> Best</div>
      <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#98a6ae]"></div> Moderate</div>
      <div class="flex items-center gap-2.5"><div class="w-2.5 h-2.5 rounded bg-[#ff3f42]"></div> Worst</div>
    </div>`
      : "";

  if (!isCompare) {
    if (performanceMode === "impact") {
      const redGradient = ctx.createLinearGradient(0, 0, 0, 400);
      redGradient.addColorStop(0, "#f87171");
      redGradient.addColorStop(1, "#ef4444");

      datasets.push({
        type: "line",
        data: baseCalc.frictionDrop,
        borderColor: "#262626",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
        order: 1,
      });

      datasets.push({
        type: "bar",
        data: baseCalc.frictionDrop,
        backgroundColor: redGradient,
        borderRadius: 8,
        barThickness: 55,
        order: 2,
      });

      tooltipLabel = "Friction Drop";
      yAxisLabel = (v) => v + "%";
    } else {
      datasets.push({
        type: "bar",
        data: baseCalc.piData,
        backgroundColor: getEfficiencyColors(baseCalc.piData, 0),
        borderRadius: 8,
        barThickness: 55,
        order: 2,
      });

      tooltipLabel = "Efficiency Index";
      yAxisLabel = (v) => v.toFixed(3);
    }
  } else {
    const slotLetters = ["B", "C", "D"];
    const redPalette = ["#D96C6C", "#E68A8A", "#F2ABAB", "#FAD4D4"]; // Vibrant equivalent to the green palette

    tooltipLabel =
      performanceMode === "impact" ? "Friction Drop" : "Efficiency Index";
    yAxisLabel =
      performanceMode === "impact" ? (v) => v + "%" : (v) => v.toFixed(3);

    datasets.push({
      label: getLayerLabel(0),
      type: "bar",
      data:
        performanceMode === "impact" ? baseCalc.frictionDrop : baseCalc.piData,
      backgroundColor:
        performanceMode === "impact"
          ? redPalette[0]
          : getEfficiencyColors(baseCalc.piData, 0),
      borderRadius: 6,
      borderWidth: 0,
    });

    lastCompLayers.forEach((layer, i) => {
      const compCalc = calcData(layer.data);
      datasets.push({
        label: getLayerLabel(i + 1),
        type: "bar",
        data:
          performanceMode === "impact"
            ? compCalc.frictionDrop
            : compCalc.piData,
        backgroundColor:
          performanceMode === "impact"
            ? redPalette[i + 1]
            : getEfficiencyColors(compCalc.piData, i + 1),
        borderRadius: 6,
        borderWidth: 0,
      });
    });
  }

  if (charts.friction) charts.friction.destroy();

  const barLabelsPlugin = {
    id: "barLabels",
    afterDatasetsDraw(chart) {
      if (!isCompare) return;
      const { ctx } = chart;

      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);
        if (meta.hidden || dataset.type !== "bar") return;

        const letter = isCompare
          ? getLayerLabel(i).split(" ")[0]
          : ["A", "B", "C", "D"][i];

        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = "900 10px Outfit";

        meta.data.forEach((bar) => {
          let yPos = bar.y - 6;
          ctx.fillStyle = "#94a3b8"; // slate-400

          if (yPos < 20) {
            yPos = bar.y + 16;
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          }

          ctx.fillText(letter, bar.x, yPos);
        });
        ctx.restore();
      });
    },
  };

  charts.friction = new Chart(ctx, {
    plugins: [barLabelsPlugin],
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
        delay: (context) => context.dataIndex * (isCompare ? 50 : 100),
      },
      plugins: {
        legend: {
          display: isCompare,
          position: "top",
          align: "end",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: { family: "Outfit", size: 10, weight: "bold" },
            color: "#64748b",
          },
        },
        tooltip: {
          enabled: true,
          displayColors: isCompare,
          backgroundColor: "#1e293b",
          padding: 15,
          cornerRadius: 12,
          titleFont: {
            family: "Outfit",
            size: isCompare ? 11 : 0,
            color: "#94a3b8",
            weight: "bold",
          },
          bodyFont: { family: "Outfit", size: 14, weight: "700" },
          callbacks: {
            title: (ctxs) => (isCompare ? ctxs[0].label : ""),
            label: (ctx) => {
              const val =
                performanceMode === "impact"
                  ? ctx.raw.toFixed(2) + "%"
                  : ctx.raw.toFixed(3);
              return isCompare
                ? `${ctx.dataset.label}: ${val}`
                : `${tooltipLabel}: ${val}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: performanceMode === "impact",
          min: performanceMode === "efficiency" && !isCompare ? 0.9 : undefined,
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
