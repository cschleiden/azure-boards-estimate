import { CardSetServiceId, MockCardSetService } from "./cardSets";
import { EstimationServiceId, MockEstimationService } from "./estimation";
import {
    IdentityService,
    IdentityServiceId,
    MockIdentityService
} from "./identity";
import { Services } from "./services";
import {
    MockSessionService,
    SessionServiceId,
    SessionService
} from "./sessions";
import { MockSprintService, SprintServiceId, SprintService } from "./sprints";
import { TeamService, TeamServiceId, MockTeamService } from "./teams";
import {
    MockWorkItemService,
    WorkItemServiceId,
    WorkItemService
} from "./workItems";

// Mock services
Services.registerService(EstimationServiceId, MockEstimationService);
Services.registerService(IdentityServiceId, MockIdentityService);
Services.registerService(TeamServiceId, MockTeamService);
Services.registerService(SessionServiceId, MockSessionService);
Services.registerService(CardSetServiceId, MockCardSetService);
Services.registerService(WorkItemServiceId, MockWorkItemService);
Services.registerService(SprintServiceId, MockSprintService);

// Override with production services
Services.registerService(IdentityServiceId, IdentityService);
Services.registerService(TeamServiceId, TeamService);
Services.registerService(SessionServiceId, SessionService);
// Services.registerService(CardSetServiceId, CardSetService);
Services.registerService(WorkItemServiceId, WorkItemService);
Services.registerService(SprintServiceId, SprintService);
