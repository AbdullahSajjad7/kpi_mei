document.addEventListener("DOMContentLoaded", function () {
  const filterBar = document.getElementById("custom-filter-bar");
  if (!filterBar) return;

  const dropdowns = filterBar.querySelectorAll(".custom-dropdown");

  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector(".custom-dropdown-btn");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("active"));
  });

  dropdowns.forEach((dropdown) => {
    const content = dropdown.querySelector(".custom-dropdown-content");
    content.addEventListener("click", (e) => e.stopPropagation());
  });

  const tableBody = document.getElementById("projects-table-body");
  const rows = tableBody ? tableBody.querySelectorAll(".project-row") : [];
  const searchInput = document.getElementById("portfolio-search");

  const filterMap = {
    stage: "data-stage",
    type: "data-type",
    solution: "data-solution",
    offtake: "data-offtake",
    kw: "data-kw",
  };

  function getSelectedValues(type) {
    const dropdown = filterBar.querySelector(
      `.custom-dropdown[data-filter-type="${type}"]`
    );
    if (!dropdown) return [];
    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map((cb) => cb.value);
  }

  function updateLabels() {
    dropdowns.forEach((dropdown) => {
      const type = dropdown.getAttribute("data-filter-type");
      const checkedCount = dropdown.querySelectorAll('input[type="checkbox"]:checked').length;
      const btn = dropdown.querySelector(".custom-dropdown-btn");

      const originalText = {
        stage: "Stage",
        type: "Project Type",
        solution: "Solution",
        offtake: "Offtake Type",
        kw: "Total kW DC",
      }[type];

      if (checkedCount > 0) {
        btn.innerHTML = `${originalText} (${checkedCount}) <span class="dropdown-arrow"></span>`;
        btn.classList.add("has-selection");
      } else {
        btn.innerHTML = `${originalText} <span class="dropdown-arrow"></span>`;
        btn.classList.remove("has-selection");
      }
    });
  }

  function filterTable() {
    const activeTab = window.activeTabFilter || "all";
    const searchVal = searchInput ? searchInput.value.toLowerCase() : "";

    const selectedFilters = {};
    for (const type in filterMap) {
      if (type !== "kw") {
        selectedFilters[type] = getSelectedValues(type);
      }
    }

    const minKWInput = document.getElementById("bar-min-kw-range");
    const maxKWInput = document.getElementById("bar-max-kw-range");
    const minKW = minKWInput ? parseInt(minKWInput.value) : 0;
    const maxKW = maxKWInput ? parseInt(maxKWInput.value) : 5000;

    rows.forEach((row) => {
      let showRow = true;

      const rowStage = row.getAttribute("data-stage");
      if (activeTab !== "all" && rowStage !== activeTab) {
        showRow = false;
      }

      if (showRow && searchVal) {
        const name = row.cells[0].textContent.toLowerCase();
        if (!name.includes(searchVal)) showRow = false;
      }

      if (showRow) {
        for (const type in filterMap) {
          if (type === "kw") {
            const rowValue = parseFloat(row.getAttribute(filterMap[type])) || 0;
            if (rowValue < minKW || rowValue > maxKW) {
              showRow = false;
              break;
            }
          } else {
            const selectedValues = selectedFilters[type];
            if (selectedValues.length > 0) {
              const rowValue = row.getAttribute(filterMap[type]);
              if (!selectedValues.includes(rowValue)) {
                showRow = false;
                break;
              }
            }
          }
        }
      }

      row.style.display = showRow ? "" : "none";
    });

    updateLabels();
  }

  const barElements = {
    minRange: document.getElementById("bar-min-kw-range"),
    maxRange: document.getElementById("bar-max-kw-range"),
    minInput: document.getElementById("bar-min-kw-val"),
    maxInput: document.getElementById("bar-max-kw-val"),
    track: document.getElementById("bar-slider-track"),
  };

  const modalElements = {
    minRange: document.getElementById("min-kw-range"),
    maxRange: document.getElementById("max-kw-range"),
    minInput: document.getElementById("min-kw-val"),
    maxInput: document.getElementById("max-kw-val"),
    track: document.getElementById("slider-track"),
  };

  function syncRangeValues(source, value, isMin) {
    let min = isMin ? parseInt(value) : (barElements.minRange ? parseInt(barElements.minRange.value) : 0);
    let max = !isMin ? parseInt(value) : (barElements.maxRange ? parseInt(barElements.maxRange.value) : 5000);

    if (isMin) {
      if (min > max - 100) max = Math.min(5000, min + 100);
    } else {
      if (max < min + 100) min = Math.max(0, max - 100);
    }

    [barElements, modalElements].forEach((set) => {
      if (set.minRange) set.minRange.value = min;
      if (set.maxRange) set.maxRange.value = max;
      if (set.minInput) set.minInput.value = min;
      if (set.maxInput) set.maxInput.value = max;
      if (set.track) {
        const p1 = (min / 5000) * 100;
        const p2 = (max / 5000) * 100;
        set.track.style.left = p1 + "%";
        set.track.style.width = (p2 - p1) + "%";
      }
    });

    filterTable();
  }

  function setupRangeListeners(set) {
    if (!set.minRange) return;
    set.minRange.addEventListener("input", (e) => syncRangeValues(set.minRange, e.target.value, true));
    set.maxRange.addEventListener("input", (e) => syncRangeValues(set.maxRange, e.target.value, false));
    set.minInput.addEventListener("input", (e) => syncRangeValues(set.minInput, e.target.value || 0, true));
    set.maxInput.addEventListener("input", (e) => syncRangeValues(set.maxInput, e.target.value || 0, false));
  }

  setupRangeListeners(barElements);
  setupRangeListeners(modalElements);

  const filterModal = document.getElementById("filter-modal");
  if (filterModal) {
    const filterPills = filterModal.querySelectorAll(".filter-pill");
    filterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pill.classList.toggle("selected");
        const pillText = pill.textContent.trim();
        const section = pill.closest(".filter-modal-section");
        const type = section ? section.getAttribute("data-filter-type") : "";
        
        const dropdown = filterBar.querySelector(`.custom-dropdown[data-filter-type="${type}"]`);
        if (dropdown) {
          const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(cb => {
            if (cb.value === pillText) {
              cb.checked = pill.classList.contains("selected");
            }
          });
        }
        filterTable();
      });
    });

    const modalOkBtn = document.getElementById("modal-ok-btn");
    const modalClearBtn = document.getElementById("modal-clear-btn");
    const modalCloseX = document.getElementById("modal-close-x");

    const closeModal = () => {
      filterModal.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (modalOkBtn) modalOkBtn.addEventListener("click", closeModal);
    if (modalCloseX) modalCloseX.addEventListener("click", closeModal);
    if (modalClearBtn) {
        modalClearBtn.addEventListener("click", () => {
            filterPills.forEach(p => p.classList.remove("selected"));
            const barCheckboxes = filterBar.querySelectorAll('input[type="checkbox"]');
            barCheckboxes.forEach(cb => cb.checked = false);
            syncRangeValues(null, 0, true);
            syncRangeValues(null, 5000, false);
            filterTable();
            closeModal();
        });
    }

    const allFiltersBtn = document.getElementById("all-filters-btn");
    if (allFiltersBtn) {
      allFiltersBtn.addEventListener("click", () => {
        filterPills.forEach(pill => {
            const pillText = pill.textContent.trim();
            const section = pill.closest(".filter-modal-section");
            const type = section ? section.getAttribute("data-filter-type") : "";
            const dropdown = filterBar.querySelector(`.custom-dropdown[data-filter-type="${type}"]`);
            if (dropdown) {
                const cb = Array.from(dropdown.querySelectorAll('input[type="checkbox"]')).find(c => c.value === pillText);
                if (cb && cb.checked) pill.classList.add("selected");
                else pill.classList.remove("selected");
            }
        });
        filterModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    }

    filterModal.addEventListener("click", (e) => {
      if (e.target === filterModal) closeModal();
    });
  }

  const allCheckboxes = filterBar.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((cb) => {
    cb.addEventListener("change", filterTable);
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterTable);
  }

  const tabs = document.querySelectorAll(".home-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setTimeout(filterTable, 0));
  });

  syncRangeValues(null, 0, true);
  syncRangeValues(null, 5000, false);
  filterTable();
});
