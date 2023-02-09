import { toLower, snakeCase } from "lodash";

const themeManager = () => {
  const activeClass = "bg-indigo-500";
  const inactiveClass = "bg-indigo-300";
  const themeBtns = document.querySelectorAll("[data-theme]");
  themeBtns.forEach((button) => {
    if (button.dataset.theme === localStorage.theme) {
      button.classList.add(activeClass);
      button.classList.remove(inactiveClass);
    } else {
      button.classList.remove(activeClass);
      button.classList.add(inactiveClass);
    }

    button.addEventListener("click", (event) => {
      const theme = event.currentTarget.dataset.theme;

      localStorage.setItem("theme", theme);
      themeBtns.forEach((btn) => {
        btn.classList.remove(activeClass);
        btn.classList.add(inactiveClass);
      });
      button.classList.add(activeClass);
      button.classList.remove(inactiveClass);

      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });
  });

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.theme = "light";
  }
};

themeManager();

// Git Helpers

const showToastMessage = (text) => {
  const alert = document.getElementById("alert");
  alert.classList.toggle("hidden");
  alert.innerText = text;
  setTimeout(() => {
    alert.classList.toggle("hidden");
  }, 3000);
};

const convertTicketNameToNormalBranchName = (name) => snakeCase(toLower(name));

// FIELDS
const ticketNameInput = document.getElementById("ticket-name");
const branchNameInput = document.getElementById("branch-name");
const copyBranchNameButton = document.getElementById("copy-branch-name-button");

const convertToBranchNameButton = document.getElementById(
  "convert-to-branch-name"
);

// EVENTS
convertToBranchNameButton.addEventListener("click", () => {
  const ticketName = ticketNameInput.value;
  if (ticketName) {
    branchNameInput.value = convertTicketNameToNormalBranchName(ticketName);
  }
});

copyBranchNameButton.addEventListener("click", async () => {
  const branchName = branchNameInput.value;
  if (branchName) {
    branchNameInput.select();
    await navigator.clipboard.writeText(branchName);
    showToastMessage("Branch name has been copied to clipboard");
  }
});
