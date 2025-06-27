const template = `
// ==UserScript==
// @name         SBI Collect Autofill (Custom)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autofills SBI Collect form up to captcha step (based on your inputs)
// @match        https://www.onlinesbi.sbi/sbicollect/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /*__USER_DATA__*/

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === "SELECT") {
                for (let i = 0; i < el.options.length; i++) {
                    if (el.options[i].text.trim() === value || el.options[i].value === value) {
                        el.selectedIndex = i;
                        el.dispatchEvent(new Event("change"));
                        break;
                    }
                }
            } else {
                el.value = value;
                el.dispatchEvent(new Event("input"));
            }
        }
    }

    function autoFillForm() {
        const filledIds = Object.keys(userData);
        filledIds.forEach(id => setValue(id, userData[id]));
    }

    const targetPageMatch = location.href.includes("listcategory.htm");
    const landingPageMatch = location.href.includes("icollecthome.htm");

    if (landingPageMatch) {
        const interval = setInterval(() => {
            const cat = document.getElementById("Category");
            if (cat) {
                setValue("Category", "PCDA SWC JAIPUR-INDIVIDUAL");
                clearInterval(interval);
            }
        }, 500);
    }

    if (targetPageMatch) {
        window.addEventListener("load", () => {
            setTimeout(autoFillForm, 1000);
        });
    }
})();
`;
