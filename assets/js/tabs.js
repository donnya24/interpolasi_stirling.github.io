/**
 * Handles tab navigation functionality
 */
document.addEventListener("DOMContentLoaded", function () {
  // Select all tab buttons and content
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Add click event listeners to each tab button
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Get the tab id from data attribute
      const tabId = button.getAttribute("data-tab");

      // Remove active class from all buttons and content
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      document.getElementById(tabId + "Tab").classList.add("active");

      // Save active tab to localStorage
      localStorage.setItem("activeTab", tabId);
    });
  });

  // Check if there's a stored active tab
  const activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    // Trigger click on the stored active tab
    const tabToActivate = document.querySelector(
      `.tab-button[data-tab="${activeTab}"]`
    );
    if (tabToActivate) {
      tabToActivate.click();
    }
  }
});
