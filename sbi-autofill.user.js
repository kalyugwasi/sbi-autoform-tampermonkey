// ==UserScript==
// @name         SBI Collect Autofill
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Autofills SBI Collect form up to captcha step (user fills only essential fields)
// @author       You
// @match        https://www.onlinesbi.sbi/sbicollect/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ========== USER-FILLED FIELDS ==========
    const userData = {
        // Fill these before using:
        outref13: "",             // Name of the Depositor *
        outref14: "",             // Personnel Number *
        outref16: "",             // PAN Number
        outref17: "",             // Mobile No. *
        outref18: "",             // Postal Address *
        outref21: "",             // AMOUNT IN RS. (ROUNDED) *

        // Auto-filled or static values
        outref11: "AO GE S Banar Jodhpur",
        outref12: "ARMY",
        outref22: "Serving Officer or Personnel",
        outref15: "",
        outref19: "ELECTRICITY AND WATER CHARGES",
        outref23: "Reoccuring Payment",
        transactionRemarks: "Advance payment",

        cusName: "",              // Name * (same as outref13)
        dateOfBirth: new Date().toLocaleDateString("en-GB"),
        mobileNo: "",             // Same as outref17
        emailId: "",              // Email ID
    };

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
        // Sync depositor name + mobile to duplicate fields
        if (!userData.cusName && userData.outref13) {
            userData.cusName = userData.outref13;
        }
        if (!userData.mobileNo && userData.outref17) {
            userData.mobileNo = userData.outref17;
        }

        const filledIds = Object.keys(userData);
        filledIds.forEach(id => setValue(id, userData[id]));
    }

    const landingPageMatch = location.href.includes("icollecthome.htm");
    const targetPageMatch = location.href.includes("listcategory.htm");

    // On landing page: select category
    if (landingPageMatch) {
        const interval = setInterval(() => {
            const cat = document.getElementById("Category");
            if (cat) {
                setValue("Category", "PCDA SWC JAIPUR-INDIVIDUAL");
                clearInterval(interval);
            }
        }, 500);
    }

    // On form page: auto-fill
    if (targetPageMatch) {
        window.addEventListener("load", () => {
            setTimeout(autoFillForm, 1000);
        });
    }
})();
