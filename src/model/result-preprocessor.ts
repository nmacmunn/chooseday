import _ from "lodash";
import type { Criterion, Option, Rating } from "../types/data";
import type {
  CriterionId,
  CriterionReady,
  RatingReady,
  UserReady,
  UserId,
} from "../types/result";

/**
 * Responsible for validating the context data used to compile the Result.
 */
export class ResultPreprocessor {
  private criteriaByUser: Record<UserId, Criterion[]>;
  private ratingsByCriterion: Record<CriterionId, Rating[]>;
  private ratingsByUser: Record<UserId, Rating[]>;

  constructor(
    private options: Option[],
    private criteria: Criterion[],
    private ratings: Rating[]
  ) {
    this.criteriaByUser = _.groupBy(this.criteria, "user.id");
    this.ratingsByCriterion = _.groupBy(this.ratings, "criterionId");
    this.ratingsByUser = _.groupBy(this.ratings, "user.id");
  }

  /**
   * Returns an array of criteria belonging to users that will participate
   * in the result. The criterion weights are normalized such that the sum
   * of all a user's criteria is 1.
   */
  getCriteria(readyUsers: UserReady[]): CriterionReady[] {
    return _(readyUsers)
      .map((user) => {
        const userCriteria = this.criteriaByUser[user.id];
        if (!userCriteria) {
          return [];
        }
        const sum = _.sumBy(userCriteria, "weight");
        return userCriteria.map((criterion) => ({
          ...criterion,
          normalized: criterion.weight / sum,
        }));
      })
      .flatten()
      .value();
  }

  /**
   * Returns an array of ratings associated with criteria that will participate
   * in the result. The rating weights are normalized such that the best option
   * has a score of 1 and the worst option has a score of 0 for a particular
   * criterion.
   */
  getRatings(readyCriteria: CriterionReady[]): RatingReady[] {
    return _(readyCriteria)
      .map((criterion) => {
        const criterionRatings = this.ratingsByCriterion[criterion.id];
        if (!criterionRatings) {
          return [];
        }
        const weights = _.map(criterionRatings, "weight");
        const max = Math.max(...weights);
        const min = Math.min(...weights);
        const range = max - min;
        return criterionRatings.map((rating) => ({
          ...rating,
          normalized: range ? (rating.weight - min) / (max - min) : undefined,
        }));
      })
      .flatten()
      .value();
  }

  /**
   * Returns an array of users with at least two criteria and the corresponding
   * number of ratings. User's are each assigned an equal weight of 1 divided
   * by the total number of participating users.
   */
  getUsers(): UserReady[] {
    return _(this.criteriaByUser)
      .map((userCriteria) => {
        const [, second] = userCriteria;
        if (!second) {
          return;
        }
        const { user } = second;
        const userRatings = this.ratingsByUser[user.id];
        if (!userRatings) {
          return;
        }
        if (userRatings.length !== this.options.length * userCriteria.length) {
          return;
        }
        return user;
      })
      .compact()
      .map((user, _i, { length }) => {
        return {
          ...user,
          normalized: 1 / length,
        };
      })
      .value();
  }
}
