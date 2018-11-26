import { SessionMode } from "../../model/session";
import { IChannel } from "../../services/channels/channels";
import { OfflineChannel } from "../../services/channels/offline";
import { SignalRChannel } from "../../services/channels/signalr";

export async function getChannel(
    sessionId: string,
    mode: SessionMode
): Promise<IChannel> {
    switch (mode) {
        case SessionMode.Online:
            // Try to create azure channel
            // TODO: Fall back to offline with polling
            return new SignalRChannel();

        case SessionMode.Offline:
            return new OfflineChannel();

        default:
            throw new Error("Unexpected mode");
    }
}
