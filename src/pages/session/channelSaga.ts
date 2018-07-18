import { eventChannel } from "redux-saga";
import { call, put, take } from "redux-saga/effects";
import { IChannel } from "../../services/channels/channels";
import { setWorkItem } from "./channelActions";

export function* channelSaga() {
    const channel: IChannel = {} as IChannel;
    const x = yield call(subscribe, channel);
    while (true) {
        const action = yield take(x);
        yield put(action);
    }
}

export function subscribe(channel: IChannel) {
    return eventChannel(emit => {
        channel.setWorkItem.attachHandler(payload => {
            emit(setWorkItem(payload));
        });

        // tslint:disable-next-line:no-empty
        return () => { };
    });
}