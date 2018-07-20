import { IWorkItem } from "../model/workitem";
import { IService } from "./services";

export interface IWorkItemService extends IService {
    getWorkItems(workItemIds: number[]): Promise<IWorkItem[]>;
}

export const WorkItemServiceId = "WorkItemService";

export class MockWorkItemService implements IWorkItemService {
    async getWorkItems(workItemIds: number[]): Promise<IWorkItem[]> {
        // Page work items, id, title and type
        // For each type, get work item type
        // Find description field (first html field)
        // page html fields


        return [
            {
                id: 42,
                title: "Admin interface",
                description: "Lorem ipsum dolor amet salvia actually microdosing polaroid drinking vinegar aesthetic put a bird on it prism master cleanse craft beer poutine. Cronut celiac church-key fanny pack butcher cloud bread. Portland af hammock cray sartorial PBR&B migas kale chips raclette. Poke schlitz forage leggings authentic yuccie prism. Banjo before they sold out aesthetic cloud bread, chartreuse helvetica YOLO shaman.",
                workItemType: "User Story"
            },
            {
                id: 23,
                title: "Chat function",
                description: "Kogi bushwick wayfarers pour-over. Aesthetic ugh godard, celiac shoreditch succulents crucifix portland roof party franzen chambray. Venmo umami polaroid trust fund. Gastropub plaid biodiesel, blue bottle vice craft beer umami messenger bag ramps microdosing tumeric waistcoat. Tbh 90's succulents affogato cold-pressed banh mi. Hexagon tbh polaroid authentic master cleanse kickstarter lo-fi selvage craft beer drinking vinegar 8-bit. Pickled schlitz bitters typewriter dreamcatcher quinoa.",
                workItemType: "Bug"
            },
            {
                id: 12,
                title: "Integration tests",
                description: "Copper mug heirloom health goth, gluten-free meditation live-edge tumblr wolf woke. Salvia truffaut gluten-free pabst brunch quinoa taxidermy, trust fund DIY tbh air plant vice master cleanse. Aesthetic pitchfork photo booth coloring book succulents pop-up. Af roof party bespoke occupy, wayfarers coloring book live-edge beard poke schlitz hella letterpress bitters skateboard tumblr. Air plant kale chips venmo, deep v butcher kogi microdosing everyday carry irony crucifix drinking vinegar cred VHS. Cloud bread vape raw denim hashtag disrupt, hexagon viral.",
                workItemType: "User Story"
            }
        ];
    }
}