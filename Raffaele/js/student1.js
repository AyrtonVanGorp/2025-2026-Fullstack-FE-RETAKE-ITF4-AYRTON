// Function to handle opening any modal
const setupModals = () => {
    const openBtns = document.querySelectorAll(".open-modal");
    const closeBtns = document.querySelectorAll(".close-modal");

    openBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const modal = document.getElementById(targetId);
            if (modal) modal.showModal();
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.closest("dialog");
            if (modal) modal.close();
        });
    });
};

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", setupModals);