const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Attend = new Schema({
    meal_id: {
        type: String
    },

    user_id: {
        type: String
	},

    user_name: {
        type: String
	},
     
    status: { //Pending, Approved, Rejected, Stand-by
        type: String
	},
    count: { //Usually 1
        type: Number
	}
});
module.exports = mongoose.model('Attend', Attend);