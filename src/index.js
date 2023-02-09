import { toLower, snakeCase, debounce, isEmpty } from "lodash";

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

// FIELDS
const ticketNameInput = document.getElementById("ticket-name");
const branchNameInput = document.getElementById("branch-name");
const gitCheckoutInput = document.getElementById("git-checkout");
const copyBranchNameButton = document.getElementById("copy-branch-name-button");
const copyGitCheckoutButton = document.getElementById(
  "copy-git-checkout-button"
);

const setFormattedValue = (value) => {
  if (isEmpty(value.trim())) return;

  const formattedText = convertTicketNameToNormalBranchName(value);
  branchNameInput.value = formattedText;
  gitCheckoutInput.value = `git checkout -b ${formattedText}`;

  const disableCopyButton = isEmpty(formattedText.trim());
  copyBranchNameButton.disabled = disableCopyButton;
  copyGitCheckoutButton.disabled = disableCopyButton;
};

// EVENTS
ticketNameInput.addEventListener(
  "input",
  debounce((event) => {
    setFormattedValue(event.target.value);
  }, 300)
);

ticketNameInput.addEventListener("paste", (event) => {
  const paste = (event.clipboardData || window.clipboardData).getData("text");
  setFormattedValue(paste);
});

const copyTextFromInputToClipboard = (input) => {
  input.select();
  navigator.clipboard.writeText(input.value);
  showToastMessage("Branch name has been copied to clipboard");
};

copyBranchNameButton.addEventListener("click", async () => {
  copyTextFromInputToClipboard(branchNameInput);
  await navigator.clipboard.writeText(branchName);
  showToastMessage("Branch name has been copied to clipboard");
});

copyGitCheckoutButton.addEventListener("click", async () => {
  copyTextFromInputToClipboard(gitCheckoutInput);
  await navigator.clipboard.writeText(branchName);
  showToastMessage("Branch name has been copied to clipboard");
});
