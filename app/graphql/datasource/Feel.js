import {cloneDeep, pick} from 'lodash';
import logger from 'bristol';
import palin from 'palin';
import MongooseAPI from '-/graphql/datasource/Mongoose';
import socket from '-/socket';

logger.addTarget('console').withFormatter(palin);

export default class FeelAPI extends MongooseAPI {
    constructor() {
        super('Feel');
    }

    async collect(params) {
        const user = this.getUser();
        const {criteria = {}} = params;
        const {searchType = 'OWNER', sortType, text} = criteria;
        const userInstance = await this.getUserInstance();
        const subscriptions = userInstance.get('subscriptions');

        params.query = {
            active: true,
            ...searchType === 'OWNER' && {
                $or: [{
                    owner: user
                }, {
                    _id: {$in: subscriptions}
                }]
            },
            ...searchType !== 'OWNER' && {
                private: {$ne: true},
                owner: {$ne: user}
            },
            ...text && {
                name: {
                    $regex: new RegExp(text, 'gi')
                }
            }
        };

        let feels;

        if (sortType) {
            const property = sortType === 'MOSTPOPULAR' ? 'subscriberCount' : 'createdAt';

            feels = await super.collect(params).sort({[property]: -1});
        } else {
            feels = await super.collect(params);
        }

        return feels.map(feel => {
            const {_id, owner = ''} = feel;

            feel.isOwner = owner.toString() === user.toString();
            feel.isSubscribed = subscriptions.some(sub => sub.toString() === _id.toString());

            return feel;
        });
    }

    async cloneFromHistory(params) {
        const {_id} = params;
        const user = this.getUser();
        const historyAPI = this.getApi('history');
        const history = await historyAPI.get(_id);

        if (!history) {
            throw new Error(`Could not find history for ${_id}`);
        }

        return this.Model.cloneFromHistory(history, {user});
    }

    async copy(params) {
        const {_id} = params;
        const user = this.getUser();
        const feel = await this.get(_id);

        return this.Model.copy(feel, {user});
    }

    async send(params) {
        const {_id, data = {}} = params;
        const {devices = []} = data;
        const user = this.getUser();
        const feel = await this.get(_id);
        const deviceIds = cloneDeep(devices);

        if (feel) {
            const deviceAPI = this.getApi('device');
            const historyAPI = this.getApi('history');
            const rooms = [];

            if (!devices.length) {
                const userInstance = await this.getUserInstance();
                const defaultDevice = userInstance.get('defaultDevice');
                const device = await deviceAPI.get(defaultDevice);
                const code = device.get('code');

                deviceIds.push(defaultDevice);
                rooms.push(code);
            } else {
                const codes = await deviceAPI.getDeviceCodes(data);

                rooms.push(...codes);
            }

            rooms.forEach(room => {
                logger.info('pushing to room', room)
                socket().to(room).emit('emote', {feel: feel.toObject()});
            });

            const historyPayload = {
                createdBy: user,
                feelSnapshot: {
                    ...pick(feel, ['duration', 'frames', 'name', 'repeat', 'reverse'])
                }
            };

            for (const deviceId of deviceIds) {
                await historyAPI.add({
                    ...historyPayload,
                    device: deviceId
                });
            }
        }

        return;
    }

    async subscribe(params) {
        const {_id} = params;
        const feel = await this.get(_id);

        if (feel) {
            const {subscriberCount: currentCount} = feel;
            const userAPI = this.getApi('user');
            const subscriberCount = currentCount + 1;

            await userAPI.subscribe({_id});
            await feel.toggleSubscription(true);
        }

        feel.isSubscribed = true;

        return feel;
    }

    async test(params) {
        const userInstance = await this.getUserInstance();
        const defaultDevice = userInstance.get('defaultDevice');

        if (!defaultDevice) {
            throw new Error('Default device hasn\'t been set');
        }

        const deviceAPI = this.getApi('device');
        const device = await deviceAPI.get(defaultDevice);

        if (!device) {
            throw new Error('Could not find device');
        }

        const code = device.get('code');

        socket().to(code).emit('emote', params);
    }

    async unsubscribe(params) {
        const {_id} = params;
        const feel = await this.get(_id);

        if (feel) {
            const {subscriberCount: currentCount} = feel;
            const userAPI = this.getApi('user');
            const subscriberCount = currentCount > 0 ? (currentCount - 1) : 0;

            await userAPI.unsubscribe({_id});
            await feel.toggleSubscription(false);
        }

        feel.isSubscribed = false;

        return feel;
    }
}
