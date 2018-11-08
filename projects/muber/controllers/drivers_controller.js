const Driver = require('../models/driver');

module.exports = {
    greetings(req,res) {
        res.send({hi :'there'})
    },

    index(req,res,next) {
        const { lng, lat } = req.query;

        Driver.aggregate([
            {
                $geoNear: {
                    near: {
                        type:'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    spherical: true,
                    distanceField: 'dist.calculated',
                    maxDistance: 200000
                }
            }
        ]).then((drivers) => res.send(drivers))
        .catch(next)
    },

    

    create(req,res,next) {
        const driverProps = req.body;
        Driver.create(driverProps)
            .then((driver) => {
                res.send(driver)
            }).catch((err) => next(err))
    },

    edit(req,res,next) {
        const driverId = req.params.id;
        const driverProps = req.body;

        Driver.findByIdAndUpdate(driverId, {$set:driverProps, $inc:{__v:1}}, {new:true})
            .then(driver => res.send(driver))
            .catch(next);
    },

    delete(req,res,next) {
        const driverId = req.params.id;
        Driver.findByIdAndRemove(driverId)
            .then(driver => res.status(204).send(driver))
            .catch(next);
    }
}