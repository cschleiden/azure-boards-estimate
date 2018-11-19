import { Spinner } from "office-ui-fabric-react";
import * as React from "react";
import { connect } from "react-redux";
import { DefaultButton, MoreButton } from "../../components/buttons";
import { Header } from "../../components/header";
import { Splitter } from "../../components/splitter";
import { WorkItemCard } from "../../components/workitems/workItemCard";
import { ICardSet } from "../../model/cards";
import { ISessionEstimates } from "../../model/estimate";
import { IIdentity } from "../../model/identity";
import { ISession } from "../../model/session";
import { IWorkItem } from "../../model/workitem";
import { IState } from "../../reducer";
import { IPageProps } from "../props";
import WorkItemView from "./components/workItemView";
import {
  loadedSession,
  leaveSession,
  loadSession,
  selectWorkItem
} from "./sessionActions";

interface ISessionParams {
  id: string;
}

interface ISessionProps extends IPageProps<ISessionParams> {
  identity: IIdentity;
  loading: boolean;
  session: ISession;
  workItems: IWorkItem[];
  estimates: ISessionEstimates;
  cardSet: ICardSet;
  selectedWorkItem: IWorkItem | null;
}

const Actions = {
  loadSession,
  loadedSession,
  selectWorkItem,
  leaveSession
};

class Session extends React.Component<
  ISessionProps & typeof Actions,
  { flipped: boolean }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      flipped: false
    };
  }

  componentDidMount() {
    this.props.loadSession(this.props.match.params.id);
  }

  render(): JSX.Element {
    const {
      session,
      loading,
      workItems,
      selectedWorkItem,
      leaveSession
    } = this.props;

    if (loading || !session) {
      return (
        <div>
          <Spinner />
        </div>
      );
    }

    return (
      <div>
        <Header
          title={session.name}
          buttons={
            <>
              <DefaultButton
                iconProps={{
                  iconName: "Leave"
                }}
                onClick={() => leaveSession()}
              >
                Leave session
              </DefaultButton>
              &nbsp;
              <MoreButton
                iconProps={{
                  iconName: "More"
                }}
                contextualMenuProps={{
                  menuProps: {
                    id: "session-more-menu",
                    items: [
                      {
                        id: "end",
                        text: "End session",
                        iconProps: {
                          iconName: "Delete"
                        }
                      }
                    ]
                  }
                }}
              />
            </>
          }
        />

        <Splitter
          left={
            <>
              {workItems.map(workItem => (
                <WorkItemCard
                  key={workItem.id}
                  selected={
                    !!selectedWorkItem && selectedWorkItem.id === workItem.id
                  }
                  id={workItem.id}
                  title={workItem.title}
                  estimate={12}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => this.props.selectWorkItem(workItem.id)}
                />
              ))}
            </>
          }
          right={<>{!!selectedWorkItem && <WorkItemView />}</>}
        />
      </div>
    );
  }
}

export default connect(
  (state: IState) => {
    return {
      identity: state.init.currentIdentity,
      loading: state.session.loading,
      session: state.session.session,
      cardSet: state.session.cardSet,
      workItems: state.session.workItems,
      estimates: state.session.estimates,
      selectedWorkItem: state.session.selectedWorkItem
    };
  },
  Actions
)(Session);
