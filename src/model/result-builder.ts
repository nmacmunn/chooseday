import _ from "lodash";
import type {
  CriterionId,
  CriterionResult,
  OptionId,
  OptionResult,
  CriterionReady,
  RatingReady,
  UserReady,
  UserResult,
  OverallScore,
  UserScore,
} from "../types/result";
import type { Option } from "../types/data";

function rank<T extends { rank: number; score: number }>(items: T[]): T[] {
  const ordered = _.orderBy(items, "score", "desc");
  return ordered.map((result, i) => {
    const prev = ordered[i - 1];
    const tied = prev && prev.score === result.score;
    result.rank = tied ? prev.rank : i + 1;
    return result;
  });
}

/**
 * Responsible for compiling preprocessed users, criteria, and ratings
 * into parameters for the Result constructor.
 */
export class ResultBuilder {
  private optionsById: Record<OptionId, Option>;
  private readyRatingsByCriterion: Record<CriterionId, RatingReady[]>;

  constructor(
    options: Option[],
    private readyUsers: UserReady[],
    private readyCriteria: CriterionReady[],
    readyRatings: RatingReady[]
  ) {
    this.optionsById = _.keyBy(options, "id");
    this.readyRatingsByCriterion = _.groupBy(readyRatings, "criterionId");
  }

  /**
   * Attempt to calculate option scores for each participating criterion. If
   * successful, ranks and sorts the options. Otherwise the criterion's results
   * field is undefined.
   */
  getCriterionResults(): CriterionResult[] {
    return this.readyCriteria.map((readyCriterion) => {
      const criterionResult = {
        ...readyCriterion,
        results: undefined,
      };
      const readyRatings = this.readyRatingsByCriterion[readyCriterion.id];
      if (!readyRatings) {
        return criterionResult;
      }
      const results: OptionResult<UserScore>[] = [];
      for (const readyRating of readyRatings) {
        const option = this.optionsById[readyRating.optionId];
        if (!option || readyRating.normalized === undefined) {
          return criterionResult;
        }
        results.push({
          ...option,
          rank: 0,
          score: readyCriterion.normalized * readyRating.normalized,
        });
      }
      return {
        ...readyCriterion,
        results: rank(results),
      };
    });
  }

  /**
   * Attempt to calculate option scores for each participating user based on
   * the specified criterion results. Applies the normalized user weight to
   * the scores. If successful, ranks and sorts the options. Otherwise,
   * the user's results field is undefined.
   */
  getUserResults(criterionResults: CriterionResult[]): UserResult[] {
    const criterionResultsByUser = _.groupBy(criterionResults, "user.id");
    return this.readyUsers.map((readyUser) => {
      const userResult = {
        ...readyUser,
        results: undefined,
      };
      const resultByOptionId: Record<OptionId, OptionResult<OverallScore>> = {};
      const criterionResults = criterionResultsByUser[readyUser.id];
      if (!criterionResults) {
        return userResult;
      }
      for (const criterionResult of criterionResults) {
        if (criterionResult.results === undefined) {
          return userResult;
        }
        for (const optionResult of criterionResult.results) {
          let userOptionResult = resultByOptionId[optionResult.id];
          if (!userOptionResult) {
            userOptionResult = {
              ...optionResult,
              rank: 0,
              score: 0,
            };
            resultByOptionId[optionResult.id] = userOptionResult;
          }
          userOptionResult.score += optionResult.score * readyUser.normalized;
        }
      }
      const results = rank(_.map(resultByOptionId));
      return {
        ...readyUser,
        results,
      };
    });
  }

  /**
   * Calculate overall option scores based on the specified user results. Users
   * with incomplete results are ignored. Results are assigned a rank and
   * sorted.
   */
  getOptionResults(userResults: UserResult[]): OptionResult<OverallScore>[] {
    const resultByOptionId: Record<string, OptionResult<OverallScore>> = {};
    for (const userResult of userResults) {
      if (userResult.results === undefined) {
        continue;
      }
      for (const optionResult of userResult.results) {
        let overallResult = resultByOptionId[optionResult.id];
        if (!overallResult) {
          overallResult = {
            ...optionResult,
            rank: 0,
            score: 0,
          };
          resultByOptionId[optionResult.id] = overallResult;
        }
        overallResult.score += optionResult.score;
      }
    }
    return rank(_.map(resultByOptionId));
  }
}
