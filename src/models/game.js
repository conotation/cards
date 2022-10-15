// --------------------------- TODO ----------------------

const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    gameNumber: {
        type: Number,
        required: true,
        unique: true,
        sparse: true
    },
    blindMax: {
        type: Number,
        required: true
    },
    blindSmall: {
        type: String,
        required: true
    },
    blindBig: {
        type: String,
        required: true
    },
    blindLevel: {
        type: Number,
        default: -1
    },
    playerCount: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    runningGame: {
       type: Boolean,
       required: true,
       default: false 
    },
    endTime: {
        type: String
    },
    finish: {
        type: Number,
        default: 1,
    },
    log: {
        type: Number
    }
});

const Game = mongoose.model('Game', gameSchema)

Game.init().then(() => {
    console.log("db init...")
})


module.exports = Game


