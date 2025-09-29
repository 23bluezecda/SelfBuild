let isDarkMode=false;

function NightMode() {
    let theme = "dark-theme";
    if (document.body.classList.contains("dark-theme")) {
        theme='black-theme';
        document.body.classList.replace("dark-theme",theme);
        isDarkMode=true;
    }
    else if (document.body.classList.contains("black-theme")) {
        theme='light-theme';
        document.body.classList.replace("black-theme",theme);
        isDarkMode=false;
    }
    else {
        document.body.classList.replace('light-theme',theme);
        isDarkMode=true;
    }

    let themeColor = getComputedStyle(document.body).getPropertyValue('--nav-color');
    document.querySelector("meta[name='theme-color']").content = themeColor;

    setCookie('theme', theme, 180);
}
