// --------------------------- TODO ----------------------

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true,
        unique: true
    },
    gameTimerCnt: {
        type: Number,
        required: true
    },
    gameTimerAll: {
        type: Number,
        required: true
    },
    gamePlayerCnt: {
        type: Number,
        default: 0
    },
    gameCategory: {
        type: Number,
        required: true
    },
    runningGame: {
        type: Boolean,
        required: true
    }

});

const Game = mongoose.model('Game', gameSchema)

module.exports = Game


