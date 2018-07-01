import { Services } from "./services";
import { MockSessionService, SessionServiceId } from "./sessions";
import { MockTeamService, TeamServiceId } from "./teams";

// Mock services
Services.registerService(TeamServiceId, MockTeamService);
Services.registerService(SessionServiceId, MockSessionService);

// Services
// Services.registerService(TeamServiceId, TeamService);
// Services.registerService(SessionServiceId, SessionService);
