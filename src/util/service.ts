import type { Sender } from "xstate";
import { authListener, getRedirectResult } from "../service/auth";
import {
  addCollaborator,
  subscribeCollaboratorDecisions,
  subscribeCreatorDecisions,
  subscribeCriteria,
  subscribeDecision,
  subscribeOptions,
  subscribeRatings,
  updateCreator,
} from "../service/db";
import type { AppContext } from "../types/context";
import type { AppEvent } from "../types/events";
import { isDecisionLoadingContext, isDecisionsLoadingContext } from "./context";
import { historyListener } from "./history";
import { hasEmail } from "./user";

const notFound = "We couldn't find that decision";
const noEmail = "You have to be signed in with Google to collaborate";

export function decisionListener(context: AppContext) {
  return (send: Sender<AppEvent>) => {
    if (!isDecisionLoadingContext(context)) {
      send({ type: "ERROR", error: "Failed to load decision" });
      return;
    }
    const { user } = context;
    const unsubDecision = subscribeDecision(context.decisionId, (decision) => {
      if (decision === undefined) {
        send({ type: "ERROR", error: notFound });
        return;
      }
      if (decision.creator.id === user.id) {
        send({ type: "DECISIONLOADED", decision });
        return;
      }
      if (decision.collaborators === null) {
        send({ type: "ERROR", error: notFound });
        return;
      }
      if (!hasEmail(user)) {
        send({ type: "ERROR", error: noEmail });
        return;
      }
      const collaborator = decision.collaborators[user.id];
      if (!collaborator) {
        addCollaborator(decision, user);
        send({ type: "DECISIONLOADED", decision });
        return;
      }
      if (collaborator.active === false) {
        send({ type: "ERROR", error: notFound });
        return;
      }
      send({ type: "DECISIONLOADED", decision });
    });
    const unsubOptions = subscribeOptions(context.decisionId, (options) => {
      send({ type: "OPTIONSLOADED", options });
    });
    const unsubCriteria = subscribeCriteria(context.decisionId, (criteria) => {
      send({ type: "CRITERIALOADED", criteria });
    });
    const unsubRatings = subscribeRatings(context.decisionId, (ratings) => {
      send({ type: "RATINGSLOADED", ratings });
    });
    return () => {
      unsubDecision();
      unsubOptions();
      unsubCriteria();
      unsubRatings();
    };
  };
}

export function decisionsListener(context: AppContext) {
  return (send: Sender<AppEvent>) => {
    if (!isDecisionsLoadingContext(context)) {
      send({ type: "ERROR", error: "Failed to load decisions" });
      return;
    }
    const unsubCreator = subscribeCreatorDecisions(
      context.user,
      (decisions) => {
        send({ type: "CREATORDECISIONSLOADED", decisions });
      }
    );
    if (!hasEmail(context.user)) {
      send({ type: "COLLABORATORDECISIONSLOADED", decisions: [] });
      return unsubCreator;
    }
    const unsubCollaborator = subscribeCollaboratorDecisions(
      context.user,
      (decisions) => {
        send({ type: "COLLABORATORDECISIONSLOADED", decisions });
      }
    );
    return () => {
      unsubCollaborator();
      unsubCreator();
    };
  };
}

export function redirectResultListener() {
  return (send: Sender<AppEvent>) => {
    getRedirectResult()
      .then((result) => {
        if (result && result.operationType === "link" && result.user.email) {
          updateCreator({ email: result.user.email, id: result.user.uid });
        }
        send({ type: "REDIRECTRESULT" });
      })
      .catch((error) => {
        send({ type: "ERROR", error });
      });
  };
}

export function urlListener() {
  return (send: Sender<AppEvent>) => {
    function route(pathname: string) {
      const segments = pathname.split("/").filter((s) => s !== "");
      if (segments[0] === "decision" && segments[1]) {
        send({ type: "LOAD", decisionId: segments[1] });
      } else {
        send({ type: "DECISIONS" });
      }
    }
    route(window.location.pathname);
    return historyListener(route);
  };
}

export function userIdListener() {
  return (send: Sender<AppEvent>) => {
    return authListener((user) => {
      if (user) {
        send({ type: "SIGNIN", user });
      } else {
        send({ type: "SIGNOUT" });
      }
    });
  };
}
