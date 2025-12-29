window.activeTabFilter = "all";

document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".home-tab");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");

      window.activeTabFilter = tab.getAttribute("data-filter");
    });
  });
});
