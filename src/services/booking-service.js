const axios = require('axios');
const { StatusCodes } = require('http-status-codes')
const { BookingRepository } = require('../repositories')
const db = require('../models')
const { ServerConfig } = require('../config');
const AppError = require('../utils/errors/app-error');

async function createBooking(data) {
    try {
        const result = await db.sequelize.transaction(async function bookingImp(t) {
            try {
                const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`)
                const flightData = flight.data.data;
                if (data.noofSeats > flightData.totalSeats) {
                    throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
                }
                return true;
            } catch (error) {
                console.log(error)
                throw error;
            }

        });
        return true
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    createBooking,
}