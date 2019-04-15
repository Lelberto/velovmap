import * as socketio from 'socket.io';
import Service, { ServiceContainer } from "./Service";
import Server from '../Server';
import InterestSchema from '../schemas/InterestSchema';
import StationSchema from '../schemas/StationSchema';

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
                }).limit(10).toArray().then((results) => {
                    clientSocket.emit('search-results', results);
                }).catch(console.error);
            });

            clientSocket.on('around', (position) => {
                this.container.mongodb.getCollection<StationSchema>('stations').find({
                    'properties.status': { $ne: 'CLOSED' },
                    'properties.available_bikes': { $gt: 0 },
                    geometry: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: position
                            },
                            $maxDistance: 500
                        }
                    }
                }).limit(5).toArray().then((stations) => {
                    clientSocket.emit('around-results', stations);
                }).catch(console.error);
            });
        });
    }
}