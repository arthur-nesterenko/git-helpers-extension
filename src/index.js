import { toSnakeCase, toKebabCase, debounce, truncate } from "./utils.js";

const FORMAT_METHOD_KEY = "formatMethod";

// Git Helpers

const showToastMessage = (() => {
  let timer;
  return (text) => {
    clearTimeout(timer);
    const alert = document.getElementById("alert");
    alert.classList.remove("hidden");
    alert.innerText = text;
    timer = setTimeout(() => {
      alert.classList.add("hidden");
    }, 3000);
  };
})();

const createNameConverter = (type) => {
  const converters = {
    snake: toSnakeCase,
    kebab: toKebabCase,
  };
  const converter = converters[type];
  if (!converter) {
    throw new Error(`Converter type ${type} is not supported`);
  }
  return converter;
};

const themeManager = () => {
  const resolvedTheme = localStorage.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  localStorage.setItem("theme", resolvedTheme);

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");

  const themeBtns = document.querySelectorAll("[data-theme]");
  themeBtns.forEach((button) => {
    const isActive = button.dataset.theme === resolvedTheme;
    button.classList.toggle("bg-indigo-500", isActive);
    button.classList.toggle("bg-indigo-300", !isActive);
    button.setAttribute("aria-pressed", String(isActive));

    button.addEventListener("click", (event) => {
      const theme = event.currentTarget.dataset.theme;
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      themeBtns.forEach((btn) => {
        const active = btn.dataset.theme === theme;
        btn.classList.toggle("bg-indigo-500", active);
        btn.classList.toggle("bg-indigo-300", !active);
        btn.setAttribute("aria-pressed", String(active));
      });
    });
  });
};

const init = () => {
  themeManager();
  const formatMethod = localStorage.getItem(FORMAT_METHOD_KEY) || "snake";

  document.querySelectorAll("input[name='case-type']").forEach((input) => {
    if (input.value === formatMethod) {
      input.checked = true;
    }
  });
};

// INIT
init();

// FIELDS
const settingsForm = document.getElementById("settings-form");
const ticketNameInput = document.getElementById("ticket-name");
const branchNameInput = document.getElementById("branch-name");
const gitCheckoutInput = document.getElementById("git-checkout");
const copyBranchNameButton = document.getElementById("copy-branch-name-button");
const copyGitCheckoutButton = document.getElementById(
  "copy-git-checkout-button"
);

const setFormattedValue = (value) => {
  if (!value.trim()) {
    branchNameInput.value = "";
    gitCheckoutInput.value = "";
    copyBranchNameButton.disabled = true;
    copyGitCheckoutButton.disabled = true;
    return;
  }

  const type = localStorage.getItem(FORMAT_METHOD_KEY) || "snake";
  const convertTicketNameToNormalBranchName = createNameConverter(type);
  const formattedText = truncate(convertTicketNameToNormalBranchName(value), 255);
  branchNameInput.value = formattedText;
  gitCheckoutInput.value = `git checkout -b ${formattedText}`;

  const disableCopyButton = !formattedText.trim();
  copyBranchNameButton.disabled = disableCopyButton;
  copyGitCheckoutButton.disabled = disableCopyButton;
};

settingsForm.addEventListener("change", (event) => {
  localStorage.setItem(FORMAT_METHOD_KEY, event.target.value);
  if (ticketNameInput.value.trim()) {
    setFormattedValue(ticketNameInput.value);
  }
});

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

const copyTextFromInputToClipboard = (input, message) => {
  input.select();
  navigator.clipboard.writeText(input.value);
  showToastMessage(message);
};

copyBranchNameButton.addEventListener("click", () => {
  copyTextFromInputToClipboard(branchNameInput, "Branch name copied to clipboard");
});

copyGitCheckoutButton.addEventListener("click", () => {
  copyTextFromInputToClipboard(gitCheckoutInput, "Checkout command copied to clipboard");
});
