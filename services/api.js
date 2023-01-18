const express = require('express');
const { getShifts, getShiftsOverlap, getRemainingSpots, getMatchingJobs, getCoWorkers, getNurses } = require('./shifts');

const api = express.Router();

api.get('/shifts', async (req, res) => {
    const shifts = await getShifts();
    res.json(shifts);
});

api.get('/shifts-overlap', async (req, res) => {
    const { shift1, shift2 } = req.query;
    try {
        const overlap = await getShiftsOverlap(Number.parseInt(shift1), Number.parseInt(shift2));
        res.json(overlap);
    } catch (error) {
        res.status(400);
        res.send(JSON.stringify(error));
    }
});

api.get('/remaining-spots', async (req, res) => {
    const results = await getRemainingSpots();
    res.json(results);
});

api.get('/matching-jobs', async (req, res) => {
    const results = await getMatchingJobs();
    res.json(results);
});

api.get('/coworkers', async (req, res) => {
    const nurseId = Number.parseInt(req.query.nurse_id);
    if (!Number.isInteger(nurseId)) {
        return res.status(400).send('Missing or invalid nurse_id parameter');
    }
    const results = await getCoWorkers(nurseId);
    res.json(results);
});

api.get('/nurses', async (req, res) => {
    const results = await getNurses();
    res.json(results);
});

module.exports = api;
