import { Channel, eventChannel } from "redux-saga";
import { call, fork, put, take, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { ISessionEstimates } from "../../model/estimate";
import { ISession } from "../../model/session";
import { IChannel } from "../../services/channels/channels";
import { getChannel } from "./channelFactory";
import { estimate, estimateSet, selectWorkItem, workItemSelected } from "./sessionActions";

export function* channelSaga(session: ISession) {
    const channel: IChannel = yield call(getChannel, session.id, session.mode);
    const estimates: ISessionEstimates = yield call([channel, channel.start], session.id);

    yield fork(channelListenerSaga, channel);
    yield fork(channelSaga2, session.id, channel);

    return estimates;
}

/**
 * Map user actions to channel calls
 */
export function* channelSaga2(sessionId: string, channel: IChannel) {
    yield takeEvery([estimate.type, selectWorkItem.type], function* (action: Action<any>) {
        switch (action.type) {
            case estimate.type:
                yield call([channel, channel.estimate], {
                    sessionId,
                    estimate: action.payload
                });
                break;

            case selectWorkItem.type:
                yield call([channel, channel.setWorkItem], {
                    sessionId,
                    workItemId: action.payload
                });
                break;
        }
    });
}

export function* channelListenerSaga(channel: IChannel) {
    const subscription: Channel<{}> = yield call(subscribe, channel);
    while (true) {
        const action = yield take(subscription);
        yield put(action);
    }
}

export function subscribe(channel: IChannel) {
    return eventChannel(emit => {
        channel.setWorkItem.attachHandler(payload => {
            // TODO: Check sessionId

            emit(workItemSelected(payload.workItemId));
        });

        channel.estimate.attachHandler(payload => {
            // TODO: Check sessionId

            emit(estimateSet(payload.estimate));
        });

        // tslint:disable-next-line:no-empty
        return () => { };
    });
}