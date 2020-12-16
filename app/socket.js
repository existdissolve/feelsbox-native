import socketio from 'socket.io';
import logger from 'bristol';
import palin from 'palin';

let instance;
logger.addTarget('console').withFormatter(palin);

export const init = server => {
    instance = socketio(server);
    instance.sockets.on('connection', socket => {
        socket.on('joinroom', room => {
            logger.info('room', room);
            logger.info('IP', socket.request.socket.remoteAddress);
            socket.join(room);
        });
    });
};

export default () => {
    return instance;
};