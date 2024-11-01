
/* 
/^[a-zA-Z][a-zA-Z 0-9]{3,32}/gi
 /^(?=.*\d)(?..*[a-z])(?..*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm 
*/

let usernameRef = document.getElementById("username");
let passwordRef = document.getElementById("password");
let submitBtn = document.getElementById("submit");
let messageRef = document.createElement("div");
messageRef.id = "message-ref";
document.body.appendChild(messageRef);

const isUsernameValid = () => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,32}$/;
    return usernameRegex.test(usernameRef.value);
};

const isPasswordValid = () => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(passwordRef.value);
};

const getUsersFromSheet = async () => {
    try {
        const response = await fetch("https://docs.google.com/spreadsheets/d/15pGG-kWoJn9ntHaQXSanTw-QuqLGPmcYi68ZE6ktH1s/export?format=csv");
        if (!response.ok) throw new Error("Network error");
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(','));
        return rows.slice(1); // Skip header row
    } catch (error) {
        messageRef.textContent = "Failed to load user data. Please try again.";
        messageRef.style.color = "red";
        messageRef.style.visibility = "visible";
        return [];
    }
};

const validateLogin = async (username, password) => {
    const users = await getUsersFromSheet();
    const user = users.find(row => row[0].trim() === username && row[1].trim() === password);

    if (user) {
        window.location.href = "success.html"; 
    } else {
        messageRef.textContent = "Invalid login details";
        messageRef.style.color = "red";
        messageRef.style.visibility = "visible";
        submitBtn.classList.add("shake");
    }
};

// Username input validation
usernameRef.addEventListener("input", () => {
    if (!isUsernameValid()) {
        messageRef.style.visibility = "hidden"; 
        usernameRef.style.cssText = "border-color: #fe2e2e; background-color: #ffc2c2"; 
    } else {
        usernameRef.style.cssText = "border-color: #white; background-color: #c2ffc2"; 
    }
});

// Submit button click event
submitBtn.addEventListener("click", async () => {
    messageRef.style.visibility = "hidden"; 
    if (isUsernameValid() && isPasswordValid()) {
        const username = usernameRef.value;
        const password = passwordRef.value;
        await validateLogin(username, password);
    } else {
        messageRef.textContent = "Please enter a valid username and password";
        messageRef.style.color = "orange";
        messageRef.style.visibility = "visible";
    }
});

// Password input validation
passwordRef.addEventListener("input", () => {
    if (!isPasswordValid()) {
        messageRef.style.visibility = "hidden"; 
        passwordRef.style.cssText = "border-color: #fe2e2e; background-color: #ffc2c2"; 
    } else {
        passwordRef.style.cssText = "border-color: #34bd34; background-color: #c2ffc2"; 
    }
});

// Submit button hover event to move it left or right
submitBtn.addEventListener("mouseover", () => { 
    // If either password or username is invalid then do this
    if (!isUsernameValid() || !isPasswordValid()) { // Check both conditions
        // Get the current position of submit button
        let containerRect = document.querySelector(".container").getBoundingClientRect(); 
        let submitRect = submitBtn.getBoundingClientRect(); 
        let offset = submitRect.left - containerRect.left;

        // If the button is on the left hand side, move it to the right hand side 
        if (offset <= 100) { 
            submitBtn.style.transform = "translateX(16.25em)"; 
        } else { 
            submitBtn.style.transform = "translateX(0)"; 
        }
    }
});

// Handle clicking the submit button to show the message
submitBtn.addEventListener("click", () => { 
    messageRef.style.visibility = "visible"; 
});
