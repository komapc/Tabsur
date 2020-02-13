const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Attend = new Schema({
    meal_id: {
        type: String
    },

    user_id: {
        type: String
	}
});
module.exports = mongoose.model('Attend', Attend);