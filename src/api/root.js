"use strict"

const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs')
const Game = require('../models/game')

router.get('/', (req, res) => {
    res.json({success: false, msg: "Using Another Endpoint"})
})

// 테스트용 페이지

router.get('/test', (req, res)=> {
    res.render('test', {})
});

// 게임 시작


router.post('/start', (req, res) => {
    let response = {}
    let gn = req.body.gameNumber
    let gtc = req.body.gameTimerCnt
    let gta = req.body.gameTimerAll
    let gpc = req.body.gamePlayerCnt
    let gcg = req.body.gameCategory

    const newGame = new Game({
        gameNumber: gn,
        gameTimerCnt: gtc,
        gameTimerAll: gta,
        gamePlayerCnt: gpc,
        gameCategory: gcg,
        runningGame: true
    });

    newGame.save()
        .then(p => {
            console.log("== New Game ==")
            console.log(p)
            response = {code: 200, msg: "Game Start"}
            res.json(response)
        }).catch(e => {
            console.log(e);
            response = {code: 400, msg: "DB Error"}
            res.json(response)
        })
});

// + gameNumber, gameTimerCnt, gameTimerAll, gamePlayerCnt, gameCategory +
// - resultCode, resultMsg -
// gameTimerAll List<int> 는 고정된게 없는지?

// 게임 종료

router.get('/end/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn

    if (isNaN(gn)){
        response = {code: 400, msg: "Query Error"}
        res.json(response)
        return
    }

    console.log(gn)

    Game.findOneAndDelete({gameNumber: gn*1})
    .then(p => {
        if(p) {
            console.log("== End Game ==")
            response = {code: 200, msg: "Game End"}
            res.json(response)
        } else {
            console.log("== Not Found Game ==")
            response = {code: 400, msg: "Not Found Game"}
            res.json(response)
        }
    })
    .catch(e => {
        console.log(e);
        response = {code: 400, msg: "DB Error"}
        res.json(response)
    })
});

// 게임 상태 조회

router.get('/state/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn

    if (isNaN(gn)){
        response = {code: 400, msg: "Query Error"}
        res.json(response)
        return
    }

    console.log(gn)

    Game.findOne({gameNumber: gn*1}, {_id: false, __v: false})
    .then(p => {
        response = p
        res.json(response)
    })
    .catch(e => {
        console.log(e)
        response = {code: 400, msg:"DB Error"}
        res.json(response)
    })

});

// 게임 설정 조회

router.get('/setting', (req, res) => {

});

// 게임 설정 초기화용

router.post('/setting/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn

    if (isNaN(gn)){
        response = {code: 400, msg: "Query Error"}
        res.json(response)
        return
    }

    const update = {}

    let geb = req.body.gameEditBlind
    if(geb) update['gameTimerCnt'] = geb

    let get = req.body.gameEditTimer
    if(get) update['gameTimerAll'] = get

    let gep = req.body.gameEditPlayer
    if(gep) update['gamePlayerCnt'] = gep

    console.log(update)

    Game.updateOne({gameNumber: gn*1}, update, { runValidators: true })
    .then(p => {
        response = p
        res.json(response)
    })
    .catch(e => {
        console.log(e)
        response = {code: 400, msg: "DB Error"}
        res.json(response)
    })

    
});

// 게임 설정 변경 2

router.put('/setting/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn

    if (isNaN(gn)){
        response = {code: 400, msg: "Query Error"}
        res.json(response)
        return
    }

    Game.findOne({gameNumber: gn*1}, {_id: false, __v: false})
    .then(p => {
        response = p
        res.json(response)
    })
    .catch(e => {
        console.log(e)
        response = {code: 400, msg:"DB Error"}
    })
});

// gameTimerCnt랑 gameEditBlind랑 같은거??

module.exports = router;