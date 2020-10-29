import {get} from 'lodash';

import MongooseAPI from '-/graphql/datasource/Mongoose';

export default class HistoryAPI extends MongooseAPI {
    constructor() {
        super('History');
    }

    async collect(params) {
        const user = this.getUser();
        const deviceAPI = this.getApi('device');
        const deviceId = get(params, 'criteria.device');
        // collect() will get all devices for this user
        const devices = await deviceAPI.collect();
        // see if
        const isOwner = devices.some(device => device.owner.toString() === user.toString() && device._id.toString() === deviceId);

        if (!isOwner) {
            throw new Error(`User does have access to requested device history: ${deviceId}`);
        }

        params.query = {
            device: deviceId
        };

        return super.collect(params);
    }

    add(params) {
        return this.Model.create(params);
    }
}
