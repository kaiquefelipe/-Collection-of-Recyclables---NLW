import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer';
import { celebrate, Joi, Segments } from 'celebrate'

import PointsController from './controllers/PointsController'
import ItemsControllers from './controllers/ItemsControllers'

const routes = express.Router();
const pointsController = new PointsController();
const itemsControllers = new ItemsControllers();

const upload = multer(multerConfig);

routes.get('/items', itemsControllers.index);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points',
    upload.single('image'),
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required()
        })
    }, {
        abortEarly: false
    }),
    pointsController.create
);


routes.get('/', (request, response) => {
    return response.json({message : "Hello World"});
});

export default routes