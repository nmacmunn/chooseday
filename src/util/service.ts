import type { Sender } from "xstate";
import { authListener } from "../service/auth";
import {
  subscribeCollaboratorDecisions,
  subscribeCreatorDecisions,
  subscribeCriteria,
  subscribeOptions,
  subscribeRatings,
} from "../service/db";
import type { AppContext } from "../types/context";
import type { AppEvent } from "../types/events";
import { hasEmail } from "./user";
import { isDecisionContext, isSignedinContext } from "./context";

export function decisionListener(context: AppContext) {
  return (send: Sender<AppEvent>) => {
    if (!isDecisionContext(context)) {
      send({ type: "ERROR", error: "Failed to load decision" });
      return;
    }
    const unsubOptions = subscribeOptions(context.decision.id, (options) => {
      send({ type: "OPTIONSLOADED", options });
    });
    const unsubCriteria = subscribeCriteria(context.decision.id, (criteria) => {
      send({ type: "CRITERIALOADED", criteria });
    });
    const unsubRatings = subscribeRatings(context.decision.id, (ratings) => {
      send({ type: "RATINGSLOADED", ratings });
    });
    return () => {
      unsubOptions();
      unsubCriteria();
      unsubRatings();
    };
  };
}

export function decisionsListener(context: AppContext) {
  return (send: Sender<AppEvent>) => {
    if (!isSignedinContext(context)) {
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
