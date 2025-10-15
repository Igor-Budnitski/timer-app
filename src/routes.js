import {parse} from 'url';
import {getAllTimes, saveCurrentTime, deleteTimeById, updateTimeById} from './repositories/timer.repository.js';

export async function router(req, res) {
    // Получаем путь (с помощью утилиты parse) и метод из запроса
    const url = parse(req.url || '', true);
    const method = req.method;
    // getting id value from URL
    const idParam = url.pathname.split('/')[2];
    // getting saved_at time
    const saved_At = url.query.saved_at;

    // check if saved_at is valid and in correct format.
    function isValidSavedAt(saved_at) {
        const date = new Date(saved_at);
        return !Number.isNaN(date.getTime()) && date.toISOString() === saved_at;
    }

    // First part of Lesson 12 HW with timer app. Replace the time in DB to new one. Wwth checks
    if (url.query.saved_at && method === 'PUT') {
        if (!isNaN(Number(idParam)) && idParam > 0) {
            if (isValidSavedAt(saved_At)) {
                const result = await updateTimeById(idParam, saved_At);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(result));
                return;
            } else {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: 'Invalid saved_at format'}));
            }
        } else {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: "Invalid timer ID"}));
        }
    }

    // Обработка запроса: GET /timer
    if (url.pathname === '/timer' && method === 'GET') {
        const times = await getAllTimes();

        // Говорим клиенту: "Всё ок, вот JSON"
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(times)); // Отправляем массив записей в формате JSON
        return;
    }

    if (url.pathname === '/timer/save' && method === 'POST') {
        const time = await saveCurrentTime();
        res.writeHead(201, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(time));
        return;
    }

    if (url.pathname?.startsWith('/timer/') && method === 'DELETE') {
        const id = url.pathname.split('/')[2];
        await deleteTimeById(id);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: `Deleted time with ID ${id}`}));
        return;
    }

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not found');
}