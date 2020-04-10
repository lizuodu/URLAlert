
// https://chajian.baidu.com/developer/extensions/tabs.html

storageKey = "b4a68e8";

var _delAlertDivs = function (tabId) {
    chrome.tabs.executeScript(tabId, {
        code: `
            var divs = document.getElementsByClassName("flash");
            Object.keys(divs)
                .forEach(() => {
                if (divs[0]) {
                    divs[0].parentNode.removeChild(divs[0]);
                }
            });
        `
    }, _=> {
        let e = chrome.runtime.lastError;
        console.log(e);
    });
};

var _addAlertDivsToPage = function (tabId, tab) {

    // 可能是新建没有指定默认url的tab
    if (!tab.url) {
        return;
    }

    var urlPrefs = JSON.parse(localStorage.getItem(storageKey) || "[]");


    urlPrefs.forEach(function (pref) {
        if (tab.url.match(pref.url)) {
            chrome.tabs.executeScript(tabId, {
                code: `
                    var style = document.createElement("style");
                    style.type = "text/css";
                    style.innerHTML = ".flash { animation: animations 2s linear infinite; } @keyframes animations { 0% { opacity: .5; } 50% { opacity: 0; } 100% { opacity: .5; } }";
                    document.getElementsByTagName("head")[0].appendChild(style);

                    var topDiv = document.createElement("div");

                    var divs = [topDiv];
                    divs.forEach(function(div, index) {
                        div.setAttribute("class", "flash");
                        if ("${pref.style}" == "page") {
                            div.style.height = "10000px";
                        } else {
                            div.style.height = "10px";
                        }
                        div.style.width = "100%";
                        div.style.background = "red";
                        div.style.position = "fixed";
                        div.style.top = 0;
                        div.style.opacity = .5;
                        div.style.zIndex = "99999999999999999";
                        div.style.pointerEvents = "none";
                        document.body.appendChild(div);
                    });

                    if ("${pref.style}" == "page") {

                    }
                `
            }, _=> {
                let e = chrome.runtime.lastError;
                console.log(e);
            });
        }
    });
}

var resetTabs = function() {
    chrome.tabs.query({}, function (tabArray) {
        tabArray.forEach((tab) => {
            _delAlertDivs(tab.id);
            _addAlertDivsToPage(tab.id, tab);
        });
    });
};



document.addEventListener("DOMContentLoaded", function () {

    resetTabs();

    chrome.tabs.onCreated.addListener(
        function (tab) {
            _addAlertDivsToPage(tab.id, tab);
        }
    );
    // 更新时(url可能改变)
    chrome.tabs.onUpdated.addListener(
        function (tabId, changeInfo, tab) {
            _delAlertDivs(tabId);
            _addAlertDivsToPage(tabId, tab);
        }
    );

    chrome.tabs.onActivated.addListener(
        function (activeInfo) {
            let tabId = activeInfo.tabId;
            _delAlertDivs(tabId);
            chrome.tabs.query({ active: true, currentWindow: true, windowId: activeInfo.windowId }, function (tabArray) {
                tabArray.forEach((tab) => {
                    _addAlertDivsToPage(tab.id, tab);
                });
            });
        }
    );

});






