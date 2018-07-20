import { SessionMode } from "../../model/session";
import { IChannel } from "../../services/channels/channels";
import { OfflineChannel } from "../../services/channels/offline";

export async function getChannel(sessionId: string, mode: SessionMode): Promise<IChannel> {
    switch (mode) {
        case SessionMode.Online:
            // Try to create azure channel
            // Fall back to offline with polling
            return new OfflineChannel();

        case SessionMode.Offline:
            return new OfflineChannel();

        default:
            throw new Error("Unexpected mode");
    }
}