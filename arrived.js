document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-arrived-form');
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const phoneInput = document.getElementById("phone");

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from refreshing the page

        // Get the form data
        const name = nameInput.value;
        const surname = surnameInput.value;
        const phone = phoneInput.value;

        // Validate phone number
        if (phone.length !== 9 || isNaN(phone)) {
            Swal.fire({
                title: "Грешка",
                text: "Телефонот мора да содржи 9 цифри.",
                icon: "error"
            });
            return; // Stop the function if validation fails
        }

        // Construct the email body
        const bodyMessage = `
            <h2>Податоци за испорака:</h2>
            <p>Име: ${name}</p>
            <p>Презиме: ${surname}</p>
            <p>Телефон: ${phone}</p>
        `;

        console.log("Sending email..."); // Debugging line

        // Send the email using SMTP.js
        Email.send({
            Host: "smtp.elasticemail.com",
            Username: "osogovoporacki@gmail.com",
            Password: "2A38F0EF3FB0948E8191C7D14369F8E013C1",
            To: 'osogovoporacki@gmail.com',
            From: "osogovoporacki@gmail.com",
            Subject: `Нова Нарачка за Испорака од ${name} ${surname}`,
            Body: bodyMessage
        }).then(
            message => {
                console.log(message); // Log the response
                if (message === "OK") {
                    Swal.fire({
                        title: "Ви благодариме!",
                        text: "Податоците се успешно испратени.",
                        icon: "success"
                    });
                    form.reset(); // Reset the form
                } else {
                    Swal.fire({
                        title: "Грешка",
                        text: "Имаше проблем при испраќањето на податоците. Обиди се повторно.",
                        icon: "error"
                    });
                }
            }
        ).catch((error) => {
            console.error("Email send failed:", error); // Log any errors
            Swal.fire({
                title: "Грешка",
                text: "Имаше проблем при испраќањето на податоците. Обиди се повторно.",
                icon: "error"
            });
        });
    });
});
