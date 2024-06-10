const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/save', (req, res) => {
    const { email, password, phoneNumber } = req.body;

    console.log('Полученные данные:', { email, password, phoneNumber });

    res.send('Данные успешно получены и обработаны!');
});

app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
