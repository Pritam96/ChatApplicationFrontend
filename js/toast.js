// Function to display a toast message
function showToast(message, type) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", `bg-${type}`, "text-white");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  const toastBody = document.createElement("div");
  toastBody.classList.add("toast-body");
  toastBody.innerText = message;

  toast.appendChild(toastBody);
  toastContainer.appendChild(toast);

  const toastInstance = new bootstrap.Toast(toast);
  toastInstance.show();

  // Remove the toast after it's hidden
  toast.addEventListener("hidden.bs.toast", function () {
    toast.remove();
  });
}

// Show success message
// showToast("Operation completed successfully", "success");

// Show error message
// showToast("Error occurred during operation", "danger");
