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
 * @api {POST} /start 게임 시작
 * 
 * 
 * @apiName startGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 시작
 * 
 * @apiParam (Body string) {Number} gameNumber 게임 번호
 * @apiParam (Body string) {Number} timerCnt 현재 블라인드 단계
 * @apiParam (Body string) {Number} blindSmall 스몰 블라인드
 * @apiParam (Body string) {Number} blindBig 빅 블라인드
 * @apiParam (Body string) {Number} payerCount 참가 인원
 * @apiParam (Body string) {Number} category 게임 종류
 * 
 *
 * @apiSuccess (Success 200) {boolean} success 성공 여부
 * @apiSuccess {String} msg 행위 관련 메시지 
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  success: true,
 *  msg: "Game Start"
 * }
 * 
 * @apiError (Error 400) {boolean} success 성공 여부 
 * @apiError (Error 400) {String} msg 상세 에러 메시지
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  success: false,
 *  msg: "Error Message Here"
 * }
 * 
 * Duplicate GameNumber : 중복된 게임 번호 존재
 * Parameter Error : 파라미터 에러, 혹은 누락
 * 
 * 
 */

// 게임 시작

router.post('/start', (req, res) => {
    let response = {}
    let gn = req.body.gameNumber
    let tc = req.body.timerCnt
    let bs = req.body.blindSmall
    let bb = req.body.blindBig
    let pc = req.body.playerCount | 0
    let ct = req.body.category

    const newGame = new Game({
        gameNumber: gn,
        timerCnt: tc,
        blindSmall: bs,
        blindBig: bb,
        playerCount: pc,
        category: ct
    });

    newGame.save()
        .then(p => {
            console.log("== New Game ==")
            console.log(p)
            response = {success: true, msg: "Game Start"}
            res.json(response)
        }).catch((e) => {
            console.log(e)
            if (e.code) {
                response = {success: false, msg: "Duplicate GameNumber"}
            } else if(e.errors){
                response = {success: false, msg: "Parameter Error"}
            }

            res.status(400).json(response)
        });
});

/**
 * @api {GET} /end/:gameNumber 게임 종료
 * 
 * @apiName endGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 종료 (게임 기록 저장)
 * 
 * @apiParam (Path string) {Number} gameNumber 게임 번호
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  success: true,
 *  msg: "Game End"
 * }
 * 
 * @apiError (Error 400) {boolean} success 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  success: false,
 *  msg: "Error Message Here"
 * }
 *
 * Parameter Error : gameNumber를 확인해주세요.
 * Not Found Game : gameNumber에 해당하는 게임이 없습니다.
 * DB Error : 쿼리 처리 중 에러가 발생하였습니다.
 * 
 */

// 게임 종료

router.get('/end/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn

    if (isNaN(gn)){
        response = {success: false, msg: "Parameter Error"}
        res.status(403).json(response)
        return
    }

    console.log(gn)

    let filter = {gameNumber: gn*1, finish: 1}
    let update = {finish: 0, gameNumber: null, log: gn*1}

    Game.findOneAndUpdate(filter, update)
    .then(p => {
        if(p) {
            console.log("== End Game ==")
            response = {success: true, msg: "Game End"}
            res.json(response)
        } else {
            console.log("== Not Found Game ==")
            response = {success: false, msg: "Not Found Game"}
            res.json(response)
        }
    })
    .catch(e => {
        console.log(e);
        response = {success: false, msg: "DB Error"}
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
 * @api {POST} /setting/:gameNumber 게임 설정 변경
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

/**
 * @api {GET} /event/:gameNumber 게임 미디어 이벤트
 * 
 * @apiName endGame
 * @apiGroup Game
 * @apiVersion 1.0.0
 * @apiDescription 게임 종료 (게임 기록 저장)
 * 
 * @apiParam (Path) {Number} gameNumber 게임 번호
 * @apiParam (Query) {Number} event 이벤트 종류 (0: 재생, 1: 일시정지, 2: 블라인드 레벨업)
 * @apiParam (Query) {String} endtime 종료시간 (Nullable)
 * 
 * @apiSuccessExample {json} Response (example):
 * {
 *  success: true,
 *  msg: "Game End"
 * }
 * 
 * @apiError (Error 400) {boolean} success 상태 코드
 * @apiError (Error 400) {String} msg 에러 메시지를 반환합니다
 * 
 * @apiErrorExample {json} Response (example):
 * {
 *  success: false,
 *  msg: "Error Message Here"
 * }
 *
 * Parameter Error : gameNumber를 확인해주세요.
 * Not Found Game : gameNumber에 해당하는 게임이 없습니다.
 * DB Error : 쿼리 처리 중 에러가 발생하였습니다.
 * 
 * 작업중
 */

// 게임 설정 변경 2

router.get('/event/:gn', (req, res) => {
    let response = {}
    let gn = req.params.gn
    let ev = req.query.event
    let endtime = req.query.endtime

    if (isNaN(gn) && isNaN(ev)){
        response = {code: 400, msg: "Query Error"}
        res.status(400).json(response)
        return
    }

    if(ev == 1){
        // 게임 일시 정지
        let filter = {gameNumber: gn*1, finish: 1}
        let update = {}
        Game.findOneAndUpdate()
        // 여기부터 작업하면됨

    } else if (ev == 0) {
        // 게임 시작

    } else if (ev == 2) {
        // 블라인드 레벨 업

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