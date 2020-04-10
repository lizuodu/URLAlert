document.addEventListener("DOMContentLoaded", function () {

    var bgPage = chrome.extension.getBackgroundPage();
    var storageKey = bgPage.storageKey;
    var localStorage = bgPage.localStorage;
    var saveButton = document.getElementById("save");

    var lines = JSON.parse(localStorage.getItem(storageKey) || "[]");
    var item = [];
    for (var i = 0; i < lines.length; i++) {
        var prefs = `${lines[i].url} ${lines[i].style}`;
        item.push(prefs);
    }
    document.getElementById("urlList").value = item.join("\n");

    saveButton.addEventListener("click", function (e) {
        var urlList = document.getElementById("urlList") || "";
        if (urlList.length <= 0) {
            return;
        }

        var item = [];
        var lines = (urlList.value || "").split("\n") || [];

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].split(" ");
            if (line.length == 2) {
                item.push({
                    url: (line[0] || "").trim(),
                    style: (line[1] || "").trim()
                });
            }
        }
        localStorage.setItem(storageKey, JSON.stringify(item));
        chrome.extension.getBackgroundPage().resetTabs();

    }, false);


});