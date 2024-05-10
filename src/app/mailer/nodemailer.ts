import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASS,
    },
})

const generatePasswordHtml = (password: string) => `
    <style>
    main {
        background: linear-gradient(to right, #01724d, #152016);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 0rem;
    }
    span {
        color: #00B473;
    }
    h1, p {
        margin: 0;
        padding: 0;
    }
    p {
        font-size: 1.5rem;
    }
    </style>
    <main>
        <h1>Портал работы <span>с текстом</span></h1>
        <p>Ваш новый пароль: <span>${password}</span></p>
    </main>
`

export const sendMail = async (to: string, text: string) =>
    transporter.sendMail({
        to,
        html: generatePasswordHtml(text)
    })