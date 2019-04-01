import * as socketio from 'socket.io';
import Service, { ServiceContainer } from "./Service";
import Server from '../Server';
import InterestSchema from '../schemas/InterestSchema';

export default class SocketService extends Service {

    public constructor(container: ServiceContainer) {
        super(container);
    }

    public async start(): Promise<void> {
        const serverSocket = socketio(Server.getInstance().http);

        serverSocket.on('connection', (clientSocket) => {
            console.log(`${clientSocket.handshake.address.toString()} connected`);

            clientSocket.on('search', (str) => {
                this.container.mongodb.getCollection<InterestSchema>('interests').find({
                    'properties.nom': {
                        $regex: `^${str}`
                    }
                }).toArray().then((results) => {
                    clientSocket.emit('search-results', results);
                }).catch(console.error);
            });
        });
    }
}