import * as signalR from "@aspnet/signalr";
import { IEstimate } from "../../model/estimate";
import { IUserInfo } from "../../model/user";
import { IdentityServiceId, IIdentityService } from "../identity";
import { Services } from "../services";
import { defineIncomingOperation, defineOperation, IChannel } from "./channels";

const baseUrl = "https://estimate-backend.azurewebsites.net/";

const enum Action {
    Join = "join",
    Left = "left",
    Estimate = "estimate",
    Reveal = "reveal",
    Add = "add",
    Switch = "switch"
};

export class SignalRChannel implements IChannel {
    estimate = defineOperation<IEstimate>(async estimate => {
        await this.sendToOtherClients(Action.Estimate, estimate);
    });

    setWorkItem = defineOperation<number>(async workItemId => {
        await this.sendToOtherClients(Action.Switch, workItemId);
    });

    revealed = defineOperation<void>(async () => {
        await this.sendToOtherClients(Action.Reveal, null);
    });

    join = defineOperation<IUserInfo>(async userInfo => {
        await this.connection.send(Action.Join, this.sessionId, userInfo);
    });

    left = defineIncomingOperation<string>();

    private connection: signalR.HubConnection;
    private sessionId: string;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;

        const identityService = Services.getService<IIdentityService>(IdentityServiceId);
        const identity = await identityService.getCurrentIdentity();

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/estimate?sessionId=${this.sessionId}&tfId=${identity.id}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Hook up handler for all messages the server sends
        this.connection.on("broadcast", this.onReceive);

        // Start connection
        await this.connection.start().catch(err => {
            // tslint:disable-next-line:no-console
            console.error(err.toString())
        });

        // Say hello to other clients
        await this.join({
            tfId: identity.id,
            name: identity.displayName
        });
    }

    async end(): Promise<void> {
        await this.connection.stop();
    }

    async sendToOtherClients<TPayload>(action: Action, payload: TPayload) {
        this.connection.send("broadcast", this.sessionId, action, payload);
    }

    private onReceive = (action: Action, payload: any) => {
        switch (action) {
            case Action.Estimate: {
                // Received estimate from another player
                this.estimate.incoming(payload);
                break;
            }

            case Action.Join: {
                // Another user has joined
                this.join.incoming(payload);
                break;
            }

            case Action.Switch: {
                this.setWorkItem.incoming(payload);
            }

            case Action.Left: {
                this.left.incoming(payload);
                break;
            }

            case Action.Reveal: {
                this.revealed.incoming(payload);
                break;
            }

            default: {
                console.error("Unknown action received: " + action);
            }
        }
    };
}