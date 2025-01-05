
let sections = document.querySelectorAll('section');

const typed = new Typed('.multiple-text', {
    strings: ['Contact', 'Request movies', ],
    typeSpeed: 100,
    backSpeed: 100,
    loop: true,
    backDelay: 1000
});

const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");

function sendEmail() {
    const bodyMessage = `Full Name:${fullName.value}<br> Email:${email.value}<br> Phone Number: ${phone.value}<br> Message: ${mess.value}`;

    Email.send({
        SecureToken: "733450c8-470d-4959-b6d1-d19034b7de3d",
        To: 'myc0382@gmail.com',
        From: "myc0382@gmail.com",
        Subject: subject.value,
        Body: bodyMessage
    }).then(message => {
        if (message === "OK") {
            Swal.fire({
                title: "Success!",
                text: "Message sent successfully!",
                icon: "success"
            });
            form.reset();
        } else {
            Swal.fire({
                title: "Oops!",
                text: "Something went wrong!",
                icon: "error"
            });
        }
    })
};


function checkInputs() {
    const items = document.querySelectorAll(".item");

    for (const item of items) {
        if (item.value == "") {
            item.classList.add("error");
            item.parentElement.classList.add("error");
        }

        if (items[1].value != "") {
            checkEmail();
        }
        items[1].addEventListener("keyup", () => {
            checkEmail();
        })

        item.addEventListener("keyup", () => {
            if (item.value != "") {
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            } else {
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        })
    }
}


function checkEmail() {
    const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errortxtemail = document.querySelector(".email")
    if (!email.value.match(emailRegex)) {
        email.classList.add("error");
        email.parentElement.classList.add("error");
        if (email.value != "") {
            errortxtemail.innerText = "Enter a valid email Address";
        } else {
            errortxtemail.innerText = "Email Address can't be blank";
        }
    } else {
        email.classList.remove("error");
        email.parentElement.classList.remove("error");
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInputs();
    if (!fullName.classList.contains("error") && !email.classList.contains("error") && !phone.classList.contains("error") && !subject.classList.contains("error") && !mess.classList.contains("error")) {
        checkEmail();
        checkInputs();
        sendEmail();
        form.reset();
    }
});