import type { Criterion, Option, Rating, User } from "./data";

export type CriterionId = string;
export type OptionId = string;
export type UserId = string;

/**
 * Score without user weights applied.
 */
export type UserScore = number;

/**
 * Score with user weights applied.
 */
export type OverallScore = number;

export type Score = UserScore | OverallScore;

/**
 * Criterion with a normalized field representing its weight in the result.
 */
export interface CriterionReady extends Criterion {
  normalized: number;
}

/**
 * Criterion with a results field representing the user's results for
 * each option.
 */
export interface CriterionResult extends Criterion {
  results: OptionResult<UserScore>[] | undefined;
}

/**
 * Option with rank and score fields.
 */
export interface OptionResult<T extends Score> extends Option {
  rank: number;
  score: T;
}

/**
 * Rating with a normalized field representing its weight in the result.
 */
export interface RatingReady extends Rating {
  normalized: number | undefined;
}

/**
 * User with a normalized field representing their weight in the result.
 */
export interface UserReady extends User {
  normalized: number;
}

/**
 * User with a results field representing the user's results for
 * each option.
 */
export interface UserResult extends User {
  results: OptionResult<OverallScore>[] | undefined;
}
