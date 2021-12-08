import { processResults } from "./results";
import type { AppContext } from "../machine";
import _ from "lodash";

export function doneRatingCurrent(context: AppContext): boolean {
  const { criterion, ratings } = context;
  if (criterion === undefined) {
    return true;
  }
  if (ratings === undefined) {
    return false;
  }
  const results = processResults(
    [criterion],
    ratings.filter(({ criterionId }) => criterionId === criterion.id)
  );
  return Object.values(results.byOption).every(Number.isFinite);
}

export function doneRating(context: AppContext): boolean {
  const { user, criteria, ratings } = context;
  if (user === undefined || criteria === undefined || ratings === undefined) {
    return false;
  }
  const predicate = _.matchesProperty("user.id", user.id);
  const results = processResults(
    criteria.filter(predicate),
    ratings.filter(predicate)
  );
  return Object.values(results.byOption).every(Number.isFinite);
}

export function enoughCriteria(context: AppContext): boolean {
  const { user, criteria } = context;
  return (
    user !== undefined &&
    criteria !== undefined &&
    criteria.filter((criterion) => criterion.user.id === user.id).length > 1
  );
}

export function enoughOptions(context: AppContext): boolean {
  return context.options !== undefined && context.options.length > 1;
}
