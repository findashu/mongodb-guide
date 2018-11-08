const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose')
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers Controller', () => {

    it('POST to /api/drivers creates a new driver', (done) => {
        // count() function deprecated use  estimatedDocumentCount
        Driver.estimatedDocumentCount().then((count) => {
            request(app) 
                .post('/api/drivers')
                .send({ email: 'test@test.com' })
                .end(() => {
                    Driver.estimatedDocumentCount().then(nCount => {
                        assert(count + 1 === nCount);
                        done();
                    });
                });
        })
    });

    it('PUT to /api/drivers/:id edits and existing driver', (done) => {
        const driver = new Driver({email:'t@t.com', driving:false});
         
        driver.save().then(() => {
            request(app)
                .put(`/api/drivers/${driver._id}`)
                .send({driving:true})
                .end(() => {
                    Driver.findOne({email:'t@t.com'})
                        .then((driver) => {
                            assert(driver.driving === true);
                            done();
                        })
                })
        })
    })

    it('DELETE to /api/drivers/:id deletes an existing driver', (done) => {
        const driver = new Driver({email:'test@test.com', driving:false});
         
        driver.save().then(() => {
            request(app)
                .delete(`/api/drivers/${driver._id}`)
                .end(() => {
                    Driver.findOne({email:'test@test.com'})
                        .then((driver) => {
                            assert(driver === null);
                            done();
                        });
                });
        });
    });

    it.only('GET to /api/drivers finds drivers in a location', (done) => {
        const seatleDriver = new Driver({
            email:'seatle@test.com',
            geometry: {type: 'Point', coordinates: [-122.4759902, 47.6147628]}
        });
        const miamiDriver = new Driver({
            email:'miami@test.com',
            geometry: {type: 'Point', coordinates: [-80.253, 25.791]}
        });

        Promise.all([seatleDriver.save(), miamiDriver.save()])
            .then(() => {
                request(app)
                    .get('/api/drivers?lng=-80&lat=25')
                    .end((err, response) => {
                        assert(response.body.length === 1);
                        assert(response.body[0].obj.email === 'miami@test.com')
                        done();
                    })
            })
    });

}); 
