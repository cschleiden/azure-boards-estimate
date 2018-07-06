import { CardSetServiceId, MockCardSetService } from "./cardSets";
import { Services } from "./services";
import { MockSessionService, SessionServiceId } from "./sessions";
import { MockTeamService, TeamServiceId } from "./teams";

// Mock services
Services.registerService(TeamServiceId, MockTeamService);
Services.registerService(SessionServiceId, MockSessionService);
Services.registerService(CardSetServiceId, MockCardSetService);

// Services
// Services.registerService(TeamServiceId, TeamService);
// Services.registerService(SessionServiceId, SessionService);
// Services.registerService(CardSetServiceId, CardSetService);
