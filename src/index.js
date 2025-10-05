const server = http.createServer((req, res) => {
    // ✅ Разрешаем запросы от любых источников
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ⚠️ Обрабатываем предварительный запрос от браузера
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 👇 Дальше — обычная логика
    router(req, res).catch((err) => {
        console.error(err);
        res.writeHead(500);
        res.end('Internal Server Error');
    });
});