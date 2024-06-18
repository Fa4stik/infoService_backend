import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    // host: 'smtp-mail.outlook.com',
    // port: 587,
    // host: 'imap.gmail.com',
    // port: 993,
    host: 'smtp.gmail.com',
    // host: "outlook.office365.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASS,
    },
})

const generateHtml = (password: string) => `
    <!doctype html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
    </head>
    <style>
    main {
        background: linear-gradient(to right, #01724d, #152016);
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 0;
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
    <body>
    <main>
        <h1>Портал работы <span>с текстом</span></h1>
        <p>Для установки пароля перейдите по ссылке: <a href="${password}">${password}</a></p>
    </main>
    </body>
    </html>
`

export const sendMail = async (to: string, subject: string, link: string) =>
    transporter.sendMail({
        from: 'Центр компентенций искусственного интелекта',
        to,
        subject,
        html: generateHtml(link)
    }, (err, data) => {
        console.log(err)
        console.log(data)
    })