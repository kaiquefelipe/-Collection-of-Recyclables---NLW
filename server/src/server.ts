import express from 'express'
import routes from './routes';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';

//Rota = endereço completo
//Recurso = QUal entidade estamos acessando do sistema

//Request Params = São parâmetros que vem na própria rota que identificam o recurso
//Query Params = São parâmetros que vem na própria rota geralemente opcionais
//Request Params = São parâmetros para criação e atualização de informações

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads' )));

app.listen(3333)