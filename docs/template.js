const template = `
// ==UserScript==
// @name         SBI Collect Autofill (Custom)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autofills SBI Collect form up to captcha step (based on your inputs), and skips the first page
// @match        https://www.onlinesbi.sbi/sbicollect/icollecthome.htm*
// @match        https://www.onlinesbi.sbi/sbicollect/payment/listcategory.htm*
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
                        el.dispatchEvent(new Event("change", { bubbles: true }));
                        break;
                    }
                }
            } else {
                el.value = value;
                el.dispatchEvent(new Event("input", { bubbles: true }));
            }
        }
    }

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.warn(\`Timed out waiting for: \${selector}\`);
            }
        }, 100);
    }

    function autoFillForm() {
        const filledIds = Object.keys(userData);
        filledIds.forEach(id => setValue(id, userData[id]));
    }

    const onLandingPage = location.href.includes("icollecthome.htm");
    const onFormPage = location.href.includes("listcategory.htm");

    if (onLandingPage) {
        waitForElement('#Category', (el) => {
            el.value = "C568137"; // value for "PCDA SWC JAIPUR-INDIVIDUAL"
            el.dispatchEvent(new Event("change", { bubbles: true }));
            console.log("✅ Category selected");

            waitForElement('input[type="submit"]', (btn) => {
                setTimeout(() => {
                    btn.click();
                    console.log("✅ Proceeding to form page...");
                }, 1000);
            });
        });
    }

    if (onFormPage) {
        window.addEventListener("load", () => {
            setTimeout(autoFillForm, 1000);
        });
    }
})();
`;
