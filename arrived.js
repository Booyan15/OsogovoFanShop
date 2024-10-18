document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('order-arrived-form');
    const nameInput = document.getElementById("name");
    const surnameInput = document.getElementById("surname");
    const addressInput = document.getElementById("address");

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from refreshing the page

        // Get the form data
        const name = nameInput.value;
        const surname = surnameInput.value;
        const address = addressInput.value;

        // Construct the email body
        const bodyMessage = `
            <h2>Податоци за испорака:</h2>
            <p>Име: ${name}</p>
            <p>Презиме: ${surname}</p>
            <p>Адреса за испорака: ${address}</p>
        `;

        // Send the email using SMTP.js
        Email.send({
            Host: "smtp.elasticemail.com",
            Username: "osogovoporacki@gmail.com",
            Password: "2A38F0EF3FB0948E8191C7D14369F8E013C1",
            To: 'osogovoporacki@gmail.com',
            From: "osogovoporacki@gmail.com",
            Subject: `За Испорака од ${name} ${surname}`,
            Body: bodyMessage
        }).then(
            message => {
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
        );
    });
});
