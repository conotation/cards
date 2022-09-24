// --------------------------- TODO ----------------------

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    gameNumber: {
        type: int,
        required: true
    },
    gameTimerCnt: {
        type: int,
        required: true
    },
    gameTimerAll: {
        type: int,
        required: true
    },
    gamePlayerCnt: {
        type: int,
        default: 0
    },
    gameCategory: {
        type: int,
        required: true
    }

});

const Game = mongoose.model('Game', gameSchema)

module.exports = Game

const buySchema = new mongoose.Schema({
    b_ref: {
        type: String,
        required: true
    },
    b_item: {
        type: String,
        required: true,
        get: (data) => {
            try {
                return JSON.parse(data);
            } catch (err) {
                return data;
            }
        },
        set: (data) => {
            return JSON.stringify(data);
        }
    },
    b_date: {
        type: Date, 
        default: Date.now
    }
})

const Buy = mongoose.model('Buy', buySchema)

module.exports = Buy


