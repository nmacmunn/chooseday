import type { AppContext } from "../machine";
import type { AppEvent } from "../types/events";
import UIKit from "uikit";
import { assign } from "xstate";

export const assignCriterion = assign<AppContext, AppEvent>({
  criterion: (context) =>
    context.criterion ||
    context.criteria?.find(
      (criterion) => criterion.user.id === context.user?.id
    ),
});

export function authError() {
  UIKit.modal.alert(
    "Failed to link account. This probably means that you have already linked another guest account. Try signing in with your Google account."
  );
}

export const clearDecision = assign<AppContext, AppEvent>({
  criteria: undefined,
  criterion: undefined,
  decision: undefined,
  ratings: undefined,
  options: undefined,
});
