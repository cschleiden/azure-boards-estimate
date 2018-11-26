// tslint:disable-next-line:no-empty-interface
export interface IService {}

export interface IServiceRegistry {
    registerService(id: string, service: IService): void;

    getService<TService extends IService>(id: string): TService;
}

class ServiceRegistry implements IServiceRegistry {
    private services: { [id: string]: new () => IService } = {};
    private servicesInstances: { [id: string]: IService } = {};

    public registerService(id: string, service: new () => IService): void {
        this.services[id] = service;
    }

    public getService<TService extends IService>(id: string): TService {
        if (!this.servicesInstances[id]) {
            if (!this.services[id]) {
                throw new Error(`Can't find service with id ${id}`);
            }

            this.servicesInstances[id] = new this.services[id]();
        }

        return this.servicesInstances[id] as TService;
    }
}

export const Services: IServiceRegistry = new ServiceRegistry();
