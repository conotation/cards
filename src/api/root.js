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

/**
 * @api {GET} /start 게임 시작
 * 
 * @apiName startGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 시작
 * 
 * @apiParam (Body string) {Number} gameNumber 결제 아이디
 * @apiParam (Body string) {Number} gameTimerCnt 결제 아이디
 * @apiParam (Body string) {Number} gameTimerAll 결제 아이디
 * @apiParam (Body string) {Number} gamePlayerCnt 결제 아이디
 * @apiParam (Body string) {Number} gameCategory 결제 아이디

 *
 * @TODO 추가예정
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  code: 200,
 *  msg: "Game Start"
 * }
 * 
 * @apiError (Error 400) {boolean} statusCode 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  code: 400,
 *  msg: "Error Message Here"
 * }
 * 
 * 수정해야되는데 일단 API 사용하는거 보고 수정 예정
 */

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

/**
 * @api {GET} /end/:gameNumber 게임 종료
 * 
 * @apiName endGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 종료
 * 
 * @apiParam (Body string) {Number} gameNumber 게임 번호
 *
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  code: 200,
 *  msg: "Game End"
 * }
 * 
 * @apiError (Error 400) {boolean} statusCode 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  code: 400,
 *  msg: "Error Message Here"
 * }
 * 
 * 수정해야되는데 일단 API 사용하는거 보고 수정 예정
 */

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

/**
 * @api {GET} /state/:gameNumber 게임 상태 조회
 * 
 * @apiName stateGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 상태 조회
 * 
 * @apiParam (Body string) {Number} gameNumber 게임 번호
 *
 * @apiSuccessExample {json} Response (example):
 * {
 *  "gameNumber": 1,
 *  "gameTimerCnt": 1,
 *  "gameTimerAll": 3,
 *  "gamePlayerCnt": 10,
 *  "gameCategory": 1,
 *  "runningGame": true
 * }
 * 
 * @apiError (Error 400) {boolean} statusCode 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  code: 400,
 *  msg: "Error Message Here"
 * }
 * 
 * 수정해야되는데 일단 API 사용하는거 보고 수정 예정
 */

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

/**
 * @api {GET} /setting/:gameNumber 게임 설정 변경
 * 
 * @apiName settingGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 설정 변경
 * 
 * @apiParam (Path string) {Number} gameNumber 게임 번호
 * @apiParam (Body string) {Number} gameEditBlind 게임의 블라인드 단계
 * @apiParam (Body string) {Number} gameEditTimer 게임의 타이머 수정
 * @apiParam (Body string) {Number} gameEditPlayer 게임의 인원 수정
 *
 * @TODO 추가예정
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  code: 200,
 *  msg: "? 뭐넣지"
 * }
 * 
 * @apiError (Error 400) {boolean} statusCode 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  code: 400,
 *  msg: "Error Message Here"
 * }
 * 
 * 수정해야되는데 일단 API 사용하는거 보고 수정 예정
 */

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