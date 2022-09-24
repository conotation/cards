"use strict"

const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')

// 게임 시작

router.post('/start', (req, res) => {

});

// + gameNumber, gameTimerCnt, gameTimerAll, gamePlayerCnt, gameCategory +
// - resultCode, resultMsg -
// gameTimerAll List<int> 는 고정된게 없는지?

// 게임 종료

router.get('/end', (req, res) => {

});

// 게임 상태 조회

router.get('/state', (req, res) => {

});

// 게임 설정 조회

router.get('/setting', (req, res) => {

});

// 게임 설정 초기화용

router.post('/setting', (req, res) => {

});

// 게임 설정 변경 2

router.put('/setting', (req, res) => {

});

module.exports = router;