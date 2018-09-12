import * as signalR from "@aspnet/signalr";
import { IUserInfo } from "../../model/user";
import { defineOperation, IChannel, IEstimatePayload, ISetWorkItemPayload } from "./channels";
import { Services } from "../services";
import { IdentityServiceId, IIdentityService } from "../identity";

// TODO: Make configurable
const baseUrl = "https://localhost:44334";

const enum Action {
    Join = "join",
    Leave = "leave",
    Estimate = "estimate",
    Reveal = "reveal",
    Add = "add",
    Switch = "switch"
};

export class SignalRChannel implements IChannel {
    estimate = defineOperation<IEstimatePayload>(async p => {
        await this.sendToOtherClients(Action.Estimate, p);
    });

    setWorkItem = defineOperation<ISetWorkItemPayload>(async p => {
        await this.sendToOtherClients(Action.Switch, p.workItemId);
    });

    join = defineOperation<IUserInfo>(async p => {
        await this.sendToOtherClients(Action.Join, p);
    });

    private connection: signalR.HubConnection;
    private sessionId: string;

    async start(sessionId: string): Promise<void> {
        this.sessionId = sessionId;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/estimate?sessionId=${this.sessionId}&tfId=${"f6642bc9-e18c-4dcd-975b-55b4d857eb02"}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.on("broadcast", this.onReceive);

        await this.connection.start().catch(err => {
            // tslint:disable-next-line:no-console
            console.error(err.toString())
        });

        // Tell other clients about us
        const identityService = Services.getService<IIdentityService>(IdentityServiceId);
        await this.sendToOtherClients(Action.Join, await identityService.getCurrentIdentity());
    }

    async end(): Promise<void> {
        await this.connection.stop();
    }

    async sendToOtherClients<TPayload>(action: Action, payload: TPayload) {
        this.connection.send("broadcast", this.sessionId, action, payload);
    }

    private onReceive = (sessionId: string, action: Action, payload: any) => {
        switch (action) {
            case Action.Estimate: {
                // Received estimate from another player
                this.estimate.incoming(payload);
                break;
            }

            case Action.Join: {
                this.join.incoming(payload);
                break;
            }
        }
    };
}