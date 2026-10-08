"use strict";

const themeStorageKey = "aiPortfolioGeneratorTheme";

document.addEventListener("DOMContentLoaded", function () {


const portfolioForm = document.getElementById("portfolioForm");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const generatePortfolioBtn = document.getElementById("generatePortfolioBtn");
const clearFormBtn = document.getElementById("clearFormBtn");

const generateAboutBtn = document.getElementById("generateAboutBtn");
const addEducationBtn = document.getElementById("addEducationBtn");
const addProjectBtn = document.getElementById("addProjectBtn");

const profilePhotoInput = document.getElementById("profilePhoto");
const loadingOverlay = document.getElementById("loadingOverlay");

const portfolioEmpty = document.getElementById("portfolioEmpty");
const portfolioDocument = document.getElementById("portfolioDocument");
const openPortfolioBtn = document.getElementById("openPortfolioBtn");

const fullNameInput = document.getElementById("fullName");
const professionalTitleInput = document.getElementById("professionalTitle");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const locationInput = document.getElementById("location");
const linkedinInput = document.getElementById("linkedin");
const githubInput = document.getElementById("github");
const aboutMeInput = document.getElementById("aboutMe");
const skillsInput = document.getElementById("skills");

const portfolioPhoto = document.getElementById("portfolioPhoto");
const defaultProfileIcon = document.getElementById("defaultProfileIcon");

const portfolioName = document.getElementById("portfolioName");
const portfolioTitle = document.getElementById("portfolioTitle");
const portfolioAboutHero = document.getElementById("portfolioAboutHero");
const portfolioAbout = document.getElementById("portfolioAbout");

const portfolioEducation = document.getElementById("portfolioEducation");
const portfolioSkills = document.getElementById("portfolioSkills");
const portfolioProjectsContainer = document.getElementById("portfolioProjectsContainer");

const portfolioEmail = document.getElementById("portfolioEmail");
const portfolioPhone = document.getElementById("portfolioPhone");
const portfolioLinkedin = document.getElementById("portfolioLinkedin");
const portfolioGithub = document.getElementById("portfolioGithub");

let profilePhotoData = "";

initializeTheme();
setupEvents();

function setupEvents() {

    themeToggle.addEventListener("click", toggleTheme);

    portfolioForm.addEventListener("submit", function (event) {
        event.preventDefault();
        generatePortfolio();
    });

    clearFormBtn.addEventListener("click", clearForm);

    generateAboutBtn.addEventListener("click", function () {
        generateAboutMe(true);
    });

    addEducationBtn.addEventListener("click", addEducation);

    addProjectBtn.addEventListener("click", addProject);

    profilePhotoInput.addEventListener("change", handleProfilePhoto);

    document.addEventListener("click", function (event) {

        const removeButton = event.target.closest(".remove-item");

        if (removeButton) {
            const item = removeButton.closest(".dynamic-item");

            if (item) {
                const container = item.parentElement;
                const items = container.querySelectorAll(".dynamic-item");

                if (items.length > 1) {
                    item.remove();
                }
            }
        }

        const projectButton = event.target.closest(".generate-project-btn");

        if (projectButton) {
            generateProjectDescription(projectButton);
        }
    });

    openPortfolioBtn.addEventListener("click", openFullPreview);
}

function initializeTheme() {

    const savedTheme = localStorage.getItem(themeStorageKey);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.className = "bi bi-sun-fill";
    } else {
        themeIcon.className = "bi bi-moon-stars-fill";
    }
}

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");

    if (isDark) {
        themeIcon.className = "bi bi-sun-fill";
    } else {
        themeIcon.className = "bi bi-moon-stars-fill";
    }
}

function generatePortfolio() {

    const fullName = getValue(fullNameInput);
    const email = getValue(emailInput);

    if (!fullName) {
        alert("Please enter your full name.");
        fullNameInput.focus();
        return;
    }

    if (!email) {
        alert("Please enter your email address.");
        emailInput.focus();
        return;
    }

    showLoading(true);

    setTimeout(function () {

        generatePersonalInformation();
        generateAboutMe(false);
        generateEducation();
        generateSkills();
        generateProjects();
        generateContact();

        portfolioEmpty.classList.add("d-none");
        portfolioDocument.classList.remove("d-none");

        openPortfolioBtn.disabled = false;

        showLoading(false);

        portfolioDocument.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 700);
}

function generatePersonalInformation() {

    const fullName = getValue(fullNameInput);
    const professionalTitle = getValue(professionalTitleInput);

    portfolioName.textContent = fullName;
    portfolioTitle.textContent = professionalTitle || "Student & Aspiring Professional";

    if (profilePhotoData) {
        portfolioPhoto.src = profilePhotoData;
        portfolioPhoto.classList.remove("d-none");
        defaultProfileIcon.classList.add("d-none");
    } else {
        portfolioPhoto.classList.add("d-none");
        defaultProfileIcon.classList.remove("d-none");
    }
}

function generateAboutMe(showMessage) {

    const name = getValue(fullNameInput);
    const title = getValue(professionalTitleInput) || "student and aspiring professional";
    const skills = getValue(skillsInput);

    let aboutText = getValue(aboutMeInput);

    if (!aboutText) {

        const firstName = name.split(" ")[0] || "I";

        if (skills) {
            aboutText =
                `${firstName} is a motivated ${title.toLowerCase()} with a strong interest in technology and continuous learning. ` +
                `With knowledge of ${skills}, ${firstName.toLowerCase()} enjoys building practical projects, solving problems, ` +
                `and developing user-friendly digital experiences.`;
        } else {
            aboutText =
                `${firstName} is a motivated ${title.toLowerCase()} who is passionate about learning new technologies, ` +
                `building practical projects, solving problems, and continuously improving professional skills.`;
        }

        aboutMeInput.value = aboutText;
    }

    portfolioAboutHero.textContent = shortenText(aboutText, 180);
    portfolioAbout.textContent = aboutText;

    if (showMessage) {
        alert("AI-generated About Me has been created.");
    }
}

function generateEducation() {

    const items = document.querySelectorAll(".education-item");

    portfolioEducation.innerHTML = "";

    let hasEducation = false;

    items.forEach(function (item) {

        const degree = getElementValue(item, ".education-degree");
        const institution = getElementValue(item, ".education-institution");
        const year = getElementValue(item, ".education-year");
        const grade = getElementValue(item, ".education-grade");

        if (!degree && !institution && !year && !grade) {
            return;
        }

        hasEducation = true;

        const educationElement = document.createElement("div");
        educationElement.className = "portfolio-education-item";

        educationElement.innerHTML = `
            <h3>${escapeHTML(degree || "Education")}</h3>
            <p>${escapeHTML(institution || "")}</p>
            <p>${escapeHTML(year || "")}${grade ? " • " + escapeHTML(grade) : ""}</p>
        `;

        portfolioEducation.appendChild(educationElement);
    });

    if (!hasEducation) {
        portfolioEducation.innerHTML = `
            <div class="portfolio-education-item">
                <h3>Education</h3>
                <p>Add your educational qualifications from the form.</p>
            </div>
        `;
    }
}

function generateSkills() {

    const skillsText = getValue(skillsInput);

    portfolioSkills.innerHTML = "";

    if (!skillsText) {
        portfolioSkills.innerHTML = `
            <span class="skill-badge">Learning</span>
            <span class="skill-badge">Problem Solving</span>
        `;
        return;
    }

    const skills = skillsText
        .split(",")
        .map(function (skill) {
            return skill.trim();
        })
        .filter(Boolean);

    skills.forEach(function (skill) {

        const badge = document.createElement("span");
        badge.className = "skill-badge";
        badge.textContent = skill;

        portfolioSkills.appendChild(badge);
    });
}

function generateProjects() {

    const items = document.querySelectorAll(".project-item");

    portfolioProjectsContainer.innerHTML = "";

    let hasProjects = false;

    items.forEach(function (item) {

        const name = getElementValue(item, ".project-name");
        let description = getElementValue(item, ".project-description");
        const technologies = getElementValue(item, ".project-technologies");

        if (!name && !description && !technologies) {
            return;
        }

        hasProjects = true;

        if (!description) {
            description = createProjectDescription(name, technologies);
        }

        const projectCard = document.createElement("div");
        projectCard.className = "portfolio-project-card";

        projectCard.innerHTML = `
            <h3>${escapeHTML(name || "My Project")}</h3>
            <p>${escapeHTML(description)}</p>
            <div class="project-tech">${escapeHTML(technologies || "Web Technologies")}</div>
        `;

        portfolioProjectsContainer.appendChild(projectCard);
    });

    if (!hasProjects) {
        portfolioProjectsContainer.innerHTML = `
            <div class="portfolio-project-card">
                <h3>My Project</h3>
                <p>Add your projects using the form to showcase your work.</p>
                <div class="project-tech">Your Technologies</div>
            </div>
        `;
    }
}

function generateContact() {

    const email = getValue(emailInput);
    const phone = getValue(phoneInput);
    const linkedin = getValue(linkedinInput);
    const github = getValue(githubInput);

    portfolioEmail.href = email ? "mailto:" + email : "#";
    portfolioEmail.querySelector("strong").textContent = email || "Email Me";

    if (phone) {
        portfolioPhone.href = "tel:" + phone.replace(/\s+/g, "");
        portfolioPhone.querySelector("strong").textContent = phone;
    } else {
        portfolioPhone.href = "#";
        portfolioPhone.querySelector("strong").textContent = "Add Phone";
    }

    if (linkedin) {
        portfolioLinkedin.href = linkedin;
        portfolioLinkedin.querySelector("strong").textContent = "Connect";
    } else {
        portfolioLinkedin.href = "#";
        portfolioLinkedin.querySelector("strong").textContent = "Add LinkedIn";
    }

    if (github) {
        portfolioGithub.href = github;
        portfolioGithub.querySelector("strong").textContent = "View Profile";
    } else {
        portfolioGithub.href = "#";
        portfolioGithub.querySelector("strong").textContent = "Add GitHub";
    }
}

function handleProfilePhoto(event) {

    const file = event.target.files[0];

    if (!file) {
        profilePhotoData = "";
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        profilePhotoInput.value = "";
        profilePhotoData = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (loadEvent) {
        profilePhotoData = loadEvent.target.result;
    };

    reader.readAsDataURL(file);
}

function addEducation() {

    const container = document.getElementById("educationContainer");

    const item = document.createElement("div");
    item.className = "dynamic-item education-item";

    item.innerHTML = `
        <button type="button" class="remove-item" title="Remove">
            <i class="bi bi-x-lg"></i>
        </button>

        <div class="mb-3">
            <label class="form-label">Degree / Course</label>
            <input type="text" class="form-control education-degree" placeholder="B.E. Computer Engineering">
        </div>

        <div class="mb-3">
            <label class="form-label">Institution</label>
            <input type="text" class="form-control education-institution" placeholder="ABC College">
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Year</label>
                <input type="text" class="form-control education-year" placeholder="2026">
            </div>

            <div class="col-md-6 mb-3">
                <label class="form-label">Grade / CGPA</label>
                <input type="text" class="form-control education-grade" placeholder="8.2 CGPA">
            </div>
        </div>
    `;

    container.appendChild(item);
}

function addProject() {

    const container = document.getElementById("projectsContainer");

    const item = document.createElement("div");
    item.className = "dynamic-item project-item";

    item.innerHTML = `
        <button type="button" class="remove-item" title="Remove">
            <i class="bi bi-x-lg"></i>
        </button>

        <div class="mb-3">
            <label class="form-label">Project Name</label>
            <input type="text" class="form-control project-name" placeholder="Portfolio Project">
        </div>

        <div class="mb-3">
            <label class="form-label">Project Description</label>
            <textarea class="form-control project-description" rows="3" placeholder="Describe your project or leave empty for AI-generated description..."></textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Technologies</label>
            <input type="text" class="form-control project-technologies" placeholder="HTML, CSS, JavaScript">
        </div>

        <button type="button" class="btn btn-small-ai generate-project-btn">
            <i class="bi bi-stars"></i> AI Description
        </button>
    `;

    container.appendChild(item);
}

function generateProjectDescription(button) {

    const projectItem = button.closest(".project-item");

    if (!projectItem) {
        return;
    }

    const projectName = getElementValue(projectItem, ".project-name");
    const technologies = getElementValue(projectItem, ".project-technologies");
    const descriptionField = projectItem.querySelector(".project-description");

    if (!projectName) {
        alert("Please enter the project name first.");
        projectItem.querySelector(".project-name").focus();
        return;
    }

    const techText = technologies || "modern web technologies";

    const generatedDescription =
        `Developed ${projectName} as a practical project using ${techText}. ` +
        `The project focuses on creating a responsive, user-friendly and functional digital experience while demonstrating problem-solving and development skills.`;

    descriptionField.value = generatedDescription;

    alert("AI-generated project description has been created.");
}

function createProjectDescription(name, technologies) {

    const techText = technologies || "modern web technologies";

    return `Developed ${name} using ${techText}. The project demonstrates practical development skills, problem-solving ability, responsive design, and a focus on creating a user-friendly experience.`;
}

function openFullPreview() {

    if (portfolioDocument.classList.contains("d-none")) {
        return;
    }

    const previewWindow = window.open("", "_blank");

    if (!previewWindow) {
        alert("Please allow pop-ups in your browser to open the full portfolio.");
        return;
    }

    const documentContent = portfolioDocument.outerHTML;

    previewWindow.document.open();

    previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${escapeHTML(getValue(fullNameInput))} - Portfolio</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            ${documentContent}
        </body>
        </html>
    `);

    previewWindow.document.close();
}

function clearForm() {

    const confirmed = confirm("Are you sure you want to clear all portfolio information?");

    if (!confirmed) {
        return;
    }

    portfolioForm.reset();

    profilePhotoData = "";

    resetEducation();
    resetProjects();

    portfolioEmpty.classList.remove("d-none");
    portfolioDocument.classList.add("d-none");

    openPortfolioBtn.disabled = true;

    portfolioPhoto.src = "";
    portfolioPhoto.classList.add("d-none");
    defaultProfileIcon.classList.remove("d-none");

    portfolioEducation.innerHTML = "";
    portfolioSkills.innerHTML = "";
    portfolioProjectsContainer.innerHTML = "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function resetEducation() {

    const container = document.getElementById("educationContainer");

    container.innerHTML = `
        <div class="dynamic-item education-item">

            <button type="button" class="remove-item d-none" title="Remove">
                <i class="bi bi-x-lg"></i>
            </button>

            <div class="mb-3">
                <label class="form-label">Degree / Course</label>
                <input type="text" class="form-control education-degree" placeholder="B.E. Computer Engineering">
            </div>

            <div class="mb-3">
                <label class="form-label">Institution</label>
                <input type="text" class="form-control education-institution" placeholder="ABC College of Engineering">
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Year</label>
                    <input type="text" class="form-control education-year" placeholder="2026">
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Grade / CGPA</label>
                    <input type="text" class="form-control education-grade" placeholder="8.2 CGPA">
                </div>
            </div>

        </div>
    `;
}

function resetProjects() {

    const container = document.getElementById("projectsContainer");

    container.innerHTML = `
        <div class="dynamic-item project-item">

            <button type="button" class="remove-item d-none" title="Remove">
                <i class="bi bi-x-lg"></i>
            </button>

            <div class="mb-3">
                <label class="form-label">Project Name</label>
                <input type="text" class="form-control project-name" placeholder="AI Study Assistant">
            </div>

            <div class="mb-3">
                <label class="form-label">Project Description</label>
                <textarea class="form-control project-description" rows="3" placeholder="Describe your project or leave empty for AI-generated description..."></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Technologies</label>
                <input type="text" class="form-control project-technologies" placeholder="HTML, CSS, JavaScript"></div>

            <button type="button" class="btn btn-small-ai generate-project-btn">
                <i class="bi bi-stars"></i> AI Description
            </button>

        </div>
    `;
}

function showLoading(show) {

    if (show) {
        loadingOverlay.classList.remove("d-none");
        generatePortfolioBtn.disabled = true;
    } else {
        loadingOverlay.classList.add("d-none");
        generatePortfolioBtn.disabled = false;
    }
}

function getValue(element) {

    if (!element) {
        return "";
    }

    return element.value.trim();
}

function getElementValue(parent, selector) {

    const element = parent.querySelector(selector);

    if (!element) {
        return "";
    }

    return element.value.trim();
}

function shortenText(text, maxLength) {

    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength).trim() + "...";
}

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


});
