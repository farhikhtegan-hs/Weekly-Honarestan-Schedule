const validCombinations = [
    "10th-elevator-group1", "10th-elevator-group2",
    "10th-gas-supply-installations-group1", "10th-gas-supply-installations-group2",
    "10th-sanitary-installations-group1", "10th-sanitary-installations-group2",
    "10th-production-and-development-of-the-base-group1", "10th-production-and-development-of-the-base-group2",
    "10th-building-electricity-group1", "10th-building-electricity-group2",
    "10th-network-and-software-group1", "10th-network-and-software-group2",

    "11th-elevator-group1", "11th-elevator-group2",
    "11th-building-electricity-group1", "11th-building-electricity-group2",
    "11th-industrial-electricity-group1", "11th-industrial-electricity-group2",
    "11th-gas-supply-installations-group1", "11th-gas-supply-installations-group2",
    "11th-sanitary-installations-group1", "11th-sanitary-installations-group2",
    "11th-network-and-software-group1", "11th-network-and-software-group2",
    "11th-production-and-development-of-the-base-group1", "11th-production-and-development-of-the-base-group2",

    "12th-elevator-group1", "12th-elevator-group2",
    "12th-building-electricity-group1", "12th-building-electricity-group2",
    "12th-industrial-electricity-group1", "12th-industrial-electricity-group2",
    "12th-gas-supply-installations-group1", "12th-gas-supply-installations-group2",
    "12th-sanitary-installations-group1", "12th-sanitary-installations-group2",
    "12th-network-and-software-group1", "12th-network-and-software-group2",
    "12th-production-and-development-of-the-base-group1", "12th-production-and-development-of-the-base-group2"
];

const fieldsOfStudy = {
    "10th": [
        { fa: "آسانسور", en: "elevator" },
        { fa: "تأسیسات گازرسانی", en: "gas-supply-installations" },
        { fa: "تأسیسات بهداشتی", en: "sanitary-installations" },
        { fa: "تولید و توسعه پایگاه", en: "production-and-development-of-the-base" },
        { fa: "برق ساختمان", en: "building-electricity" },
        { fa: "شبکه و نرم‌افزار", en: "network-and-software" }
    ],
    "11th": [
        { fa: "آسانسور", en: "elevator" },
        { fa: "برق ساختمان", en: "building-electricity" },
        { fa: "برق صنعتی", en: "industrial-electricity" },
        { fa: "تأسیسات گازرسانی", en: "gas-supply-installations" },
        { fa: "تأسیسات بهداشتی", en: "sanitary-installations" },
        { fa: "شبکه و نرم‌افزار", en: "network-and-software" },
        { fa: "تولید و توسعه پایگاه", en: "production-and-development-of-the-base" }
    ],
    "12th": [
        { fa: "آسانسور", en: "elevator" },
        { fa: "برق ساختمان", en: "building-electricity" },
        { fa: "برق صنعتی", en: "industrial-electricity" },
        { fa: "تأسیسات گازرسانی", en: "gas-supply-installations" },
        { fa: "تأسیسات بهداشتی", en: "sanitary-installations" },
        { fa: "شبکه و نرم‌افزار", en: "network-and-software" },
        { fa: "تولید و توسعه پایگاه", en: "production-and-development-of-the-base" }
    ]
};

function updateFields() {
    const grade = document.getElementById("grade").value;
    const fieldSelect = document.getElementById("field-of-study");

    fieldSelect.innerHTML = '<option value="" disabled selected>رشته خود را انتخاب کنید...</option>';

    if (fieldsOfStudy[grade]) {
        fieldsOfStudy[grade].forEach(field => {
            const option = document.createElement("option");
            option.value = field.en;
            option.textContent = field.fa;
            fieldSelect.appendChild(option);
        });
    }
}

function loginCheck() {
    const cookie = getCookie('login');

    if (!cookie) {
        document.querySelector('.login-container').style.display = 'flex';
        document.querySelector('.schedule-container').style.display = 'none';
        console.log("No login cookie found. User might not be logged in.");
        return;
    }

    console.log("Cookie from user:", cookie);
    
    const parts = cookie.split('-');
    
    if (parts.length < 3) {
        console.error("Invalid cookie format.");
        return;
    }

    const selectedGrade = parts[0];
    const selectedGroup = parts[parts.length - 1];

    let selectedFieldOfStudy;

    if (parts.length > 3) {
        selectedFieldOfStudy = parts.slice(1, parts.length - 1).join('-').replace(/-/g, ' ');
    } else {
        selectedFieldOfStudy = parts[1];
    }

    getCurrentDayOfWeek().then(({ currentDayFa, currentDayEn }) => {
        if (currentDayEn) {
            console.log("Selected Grade:", selectedGrade);
            console.log("Selected Field of Study:", selectedFieldOfStudy);
            console.log("Selected Group:", selectedGroup);

            document.getElementById('current-day').textContent = currentDayFa;

            if (validCombinations.includes(`${selectedGrade}-${selectedFieldOfStudy.replace(/ /g, '-')}-${selectedGroup}`)) {
                console.log("Login successful: grade, field of study, and group match.");
                document.querySelector('.login-container').style.display = 'none';
                document.querySelector('.schedule-container').style.display = 'flex';
                document.querySelector('.nav').style.display = 'flex';
                
                loadAndDisplaySchedule(selectedGrade, selectedFieldOfStudy, selectedGroup, currentDayEn);
            } else {
                document.querySelector('.login-container').style.display = 'flex';
                document.querySelector('.schedule-container').style.display = 'none';
                document.querySelector('.nav').style.display = 'none';
                console.log("Login failed: invalid grade, field of study, or group.");
                showMessage('error', 'اطلاعات ورود نامعتبر است.');
            }
        }
    });
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

function getFieldValues() {
    const grade = document.getElementById('grade').value;
    const fieldOfStudy = document.getElementById('field-of-study').value;

    if (!grade || !fieldOfStudy) {
        showMessage('error', 'لطفاً همه فیلد را پر کنید.');
        throw new Error('Fields cannot be empty');
    }

    return { grade, fieldOfStudy };
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

const daysOfWeekFa = ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
const daysOfWeekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getCurrentDayOfWeek() {
    return fetch('http://worldtimeapi.org/api/timezone/Asia/Tehran')
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.datetime);
            const dayOfWeek = dateTime.getDay();
            const currentDayFa = daysOfWeekFa[dayOfWeek];
            const currentDayEn = daysOfWeekEn[dayOfWeek];
            console.log("Day of the week (FA):", currentDayFa);
            console.log("Day of the week (EN):", currentDayEn);
            return { currentDayFa, currentDayEn };
        })
        .catch(error => {
            console.error('Error fetching the current day of the week:', error);
        });
}

document.getElementById('login-btn').addEventListener('click', () => {
    try {
        const { grade, fieldOfStudy } = getFieldValues();
        const group = document.getElementById('group').value;
        
        if (!group) {
            showMessage('error', 'لطفاً یک گروه را انتخاب کنید.');
            return;
        }

        setCookie('login', `${grade}-${fieldOfStudy}-${group}`, 365);
        showMessage('success', 'ورود با موفقیت انجام شد');
        loginCheck();
    } catch (error) {
        console.error('Error during login:', error);
    }
});

document.getElementById("logout-btn").addEventListener("click", function() {
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    location.reload();
});

function loadAndDisplaySchedule(selectedGrade, selectedFieldOfStudy, selectedGroup, dayOfWeek) {
    fetch('assets/config/main.config.json')
        .then(response => response.json())
        .then(data => {
            // دریافت برنامه روزانه بر اساس پارامترها
            const schedule = data[selectedGrade]?.[selectedFieldOfStudy]?.[selectedGroup]?.[dayOfWeek];
            const scheduleRows = document.querySelector('.schedule-rows');
            
            scheduleRows.innerHTML = ''; // پاک کردن برنامه قبلی
            
            // بررسی و نمایش برنامه درسی
            if (schedule && schedule.length > 0) {
                console.log(`Schedule for ${selectedGrade} - ${selectedFieldOfStudy} - ${selectedGroup} on ${dayOfWeek}:`);
                
                schedule.forEach((item, index) => {
                    const row = document.createElement('div');
                    row.classList.add('schedule-row');

                    // ایجاد هر سطر از برنامه درسی
                    row.innerHTML = `
                        <div class="schedule-cell">${item.lesson}</div>
                        <div class="schedule-cell">${item.teacher}</div>
                        <div class="schedule-cell">${item.class}</div>
                        <div class="schedule-cell">${item.startTime}</div>
                        <div class="schedule-cell">${item.endTime}</div>
                    `;

                    scheduleRows.appendChild(row);
                });
            } else {
                console.log(`No classes scheduled for ${selectedGrade} - ${selectedFieldOfStudy} - ${selectedGroup} on ${dayOfWeek}.`);
                
                const emptyMessage = document.createElement('div');
                emptyMessage.classList.add('schedule-cell');
                emptyMessage.textContent = 'برای این روز هیچ کلاسی برنامه‌ریزی نشده است';
                scheduleRows.appendChild(emptyMessage);
            }
        })
        .catch(error => {
            console.error('Error fetching the schedule:', error);
            
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'خطا در بارگذاری برنامه درسی. لطفاً دوباره تلاش کنید';
            scheduleRows.appendChild(errorMessage);
        });
}

function showMessage(type, message) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    if (type === 'success') {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    } else if (type === 'error') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    setTimeout(() => {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }, 3000);
}

window.onload = loginCheck;
