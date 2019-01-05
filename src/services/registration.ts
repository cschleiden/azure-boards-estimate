import { CardSetServiceId, MockCardSetService } from "./cardSets";
import { EstimationServiceId, MockEstimationService } from "./estimation";
import { IdentityService, IdentityServiceId } from "./identity";
import { QueriesService, QueriesServiceId } from "./queries";
import { Services } from "./services";
import { SessionService, SessionServiceId } from "./sessions";
import { SprintService, SprintServiceId } from "./sprints";
import { TeamService, TeamServiceId } from "./teams";
import { WorkItemService, WorkItemServiceId } from "./workItems";

// Mock services
Services.registerService(EstimationServiceId, MockEstimationService);
Services.registerService(CardSetServiceId, MockCardSetService);

Services.registerService(IdentityServiceId, IdentityService);
Services.registerService(TeamServiceId, TeamService);
Services.registerService(SessionServiceId, SessionService);
// Services.registerService(CardSetServiceId, CardSetService);
Services.registerService(WorkItemServiceId, WorkItemService);
Services.registerService(SprintServiceId, SprintService);
Services.registerService(QueriesServiceId, QueriesService);
