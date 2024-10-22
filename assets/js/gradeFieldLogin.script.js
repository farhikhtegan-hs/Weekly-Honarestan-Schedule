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
        "آسانسور",
        "تأسیسات گازرسانی",
        "تأسیسات بهداشتی",
        "تولید و توسعه پایگاه",
        "برق ساختمان",
        "شبکه و نرم‌افزار"
    ],
    "11th": [
        "آسانسور",
        "برق ساختمان",
        "برق صنعتی",
        "تأسیسات گازرسانی",
        "تأسیسات بهداشتی",
        "شبکه و نرم‌افزار",
        "تولید و توسعه پایگاه"
    ],
    "12th": [
        "آسانسور",
        "برق ساختمان",
        "برق صنعتی",
        "تأسیسات گازرسانی",
        "تأسیسات بهداشتی",
        "شبکه و نرم‌افزار",
        "تولید و توسعه پایگاه"
    ]
};

function updateFields() {
    const grade = document.getElementById("grade").value;
    const fieldSelect = document.getElementById("field-of-study");

    fieldSelect.innerHTML = '<option value="" disabled selected>Choose your field...</option>';

    if (fieldsOfStudy[grade]) {
        fieldsOfStudy[grade].forEach(field => {
            const option = document.createElement("option");
            option.value = field.toLowerCase().replace(/\s+/g, '-');
            option.textContent = field;
            fieldSelect.appendChild(option);
        });
    }
}

// Check Login
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
    
    const dayOfWeek = 'Saturday';

    console.log("Selected Grade:", selectedGrade);
    console.log("Selected Field of Study:", selectedFieldOfStudy);
    console.log("Selected Group:", selectedGroup);
    
    if (validCombinations.includes(`${selectedGrade}-${selectedFieldOfStudy.replace(/ /g, '-')}-${selectedGroup}`)) {
        console.log("Login successful: grade, field of study, and group match.");
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.schedule-container').style.display = 'flex';
        document.querySelector('.nav').style.display = 'flex';
        
        loadAndDisplaySchedule(selectedGrade, selectedFieldOfStudy, selectedGroup, dayOfWeek);
    } else {
        document.querySelector('.login-container').style.display = 'flex';
        document.querySelector('.schedule-container').style.display = 'none';
        document.querySelector('.nav').style.display = 'none';
        console.log("Login failed: invalid grade, field of study, or group.");
        showMessage('error', 'Invalid login details.');
    }
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
        showMessage('error', 'Please fill out both fields.');
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

document.getElementById('login-btn').addEventListener('click', () => {
    try {
        const { grade, fieldOfStudy } = getFieldValues();
        const group = document.getElementById('group').value;
        
        if (!group) {
            showMessage('error', 'Please select a group.');
            return;
        }

        setCookie('login', `${grade}-${fieldOfStudy}-${group}`, 365);
        showMessage('success', 'Login successful!');
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
            const schedule = data[selectedGrade]?.[selectedFieldOfStudy]?.[selectedGroup]?.[dayOfWeek];
            const scheduleRows = document.querySelector('.schedule-rows');
            
            scheduleRows.innerHTML = '';

            if (schedule && schedule.length > 0) {
                console.log(`Schedule for ${selectedGrade} - ${selectedFieldOfStudy} - ${selectedGroup} on ${dayOfWeek}:`);
                
                schedule.forEach((item, index) => {
                    const row = document.createElement('div');
                    row.classList.add('schedule-row');

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
            }
        })
        .catch(error => {
            console.error('Error fetching the schedule:', error);
        });
}

window.onload = loginCheck;
