import { Channel, eventChannel, SagaIterator } from "redux-saga";
import {
    all,
    call,
    cancelled,
    put,
    select,
    take,
    takeEvery
} from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { ISession } from "../../model/session";
import { ISnapshot } from "../../model/snapshots";
import { IChannel } from "../../services/channels/channels";
import { connected } from "./channelActions";
import { getChannel } from "./channelFactory";
import { getSnapshot } from "./selector";
import {
    estimate,
    estimateSet,
    estimateUpdated,
    reveal,
    revealed,
    selectWorkItem,
    snapshotReceived,
    userJoined,
    userLeft,
    workItemSelected
} from "./sessionActions";

export function* channelSaga(session: ISession): SagaIterator {
    const channel: IChannel = yield call(getChannel, session.id, session.mode);
    yield call([channel, channel.start], session.id);

    yield put(connected());

    try {
        yield all([
            call(channelListenerSaga, channel),
            call(channelSenderSaga, session.id, channel)
        ]);
    } finally {
        if (yield cancelled()) {
            yield call([channel, channel.end]);
        }
    }
}

/**
 * Map user actions to outgoing channel calls
 */
export function* channelSenderSaga(sessionId: string, channel: IChannel) {
    yield takeEvery(
        [estimate.type, estimateUpdated.type, selectWorkItem.type, reveal.type],
        function*(action: Action<any>) {
            switch (action.type) {
                case estimate.type:
                    yield call([channel, channel.estimate], action.payload);
                    break;

                case estimateUpdated.type:
                    if (!action.payload.remote) {
                        // Only send if this wasn't a remote action
                        yield call(
                            [channel, channel.estimateUpdated],
                            action.payload
                        );
                    }
                    break;

                case selectWorkItem.type:
                    yield call([channel, channel.setWorkItem], action.payload);
                    break;

                case reveal.type: {
                    yield call([channel, channel.revealed], undefined);
                    break;
                }
            }
        }
    );
}

/**
 * Take channel actions and map them to redux actions
 */
export function* channelListenerSaga(channel: IChannel) {
    const subscription: Channel<{}> = yield call(subscribe, channel);
    while (true) {
        const action = yield take(subscription);

        switch (action.type) {
            case userJoined.type: {
                // New user has joined, send snapshot
                const snapshot: ISnapshot = yield select(getSnapshot);
                yield call([channel, channel.snapshot], snapshot);
                break;
            }
        }

        yield put(action);
    }
}

export function subscribe(channel: IChannel) {
    return eventChannel(emit => {
        channel.setWorkItem.attachHandler(workItemId => {
            emit(workItemSelected(workItemId));
        });

        channel.estimate.attachHandler(e => {
            emit(estimateSet(e));
        });

        channel.estimateUpdated.attachHandler(e => {
            emit(
                estimateUpdated({
                    ...e,
                    remote: true
                })
            );
        });

        channel.join.attachHandler(payload => {
            emit(userJoined(payload));
        });

        channel.left.attachHandler(payload => {
            emit(userLeft(payload));
        });

        channel.revealed.attachHandler(() => {
            emit(revealed());
        });

        channel.snapshot.attachHandler(snapshot => {
            // Snapshot received
            emit(snapshotReceived(snapshot));
        });

        // tslint:disable-next-line:no-empty
        return () => {};
    });
}
