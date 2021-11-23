import type { Criterion, Option, Rating, User } from "../types/data";
import * as _ from "lodash";

type CriterionId = string & {};
type OptionId = string & {};
type UserId = string & {};

type ByOption = Record<OptionId, number>;

type ByCriterion = Record<
  CriterionId,
  {
    byOption: ByOption;
    sorted: string[];
    criterion: Criterion;
  }
>;

type ByUser = Record<
  UserId,
  {
    byCriterion: ByCriterion;
    byOption: ByOption;
    sorted: string[];
    user: User;
  }
>;

export interface Processed {
  byOption: ByOption;
  // byCriterion: ByCriterion;
  byUser: ByUser;
}

/**
 * Returns a map of criteriaId => (0...1]
 *
 * This assumes that criteria weights are always positive
 */
function getCriteriaScores(criteria: Criterion[]): Record<CriterionId, number> {
  const sum = _.sumBy(criteria, "weight");
  return _.chain(criteria)
    .groupBy("id")
    .mapValues(([{ weight }]) => weight / sum)
    .value();
}

/**
 * Returns a map of criterionId => optionId => [0...1]
 *
 * @todo make sure there is a difference between min and max weights
 */
function getRatingsScores(
  ratings: Rating[]
): Record<CriterionId, Record<OptionId, number>> {
  return _.chain(ratings)
    .groupBy("criterionId")
    .mapValues((criterionRatings, criterionId) => {
      const weights = _.map(criterionRatings, "weight");
      const max = Math.max(...weights);
      const min = Math.min(...weights);
      return _.chain(criterionRatings)
        .groupBy("optionId")
        .mapValues(([{ weight }]) => (weight - min) / (max - min))
        .value();
    })
    .value();

  // const ratingsByCriterion = _.groupBy(ratings, "criterionId");
  // return _.mapValues(ratingsByCriterion, (ratings) => {
  //   // get the min and max of ratings
  //   const weights = _.map(ratings, "weight");
  //   const max = Math.max(...weights);
  //   const min = Math.min(...weights);
  //   // calculate a value from 0 to 1 for each rating
  //   const values = ratings.map(({ optionId, weight }) => ({
  //     optionId,
  //     value: (weight - min) / (max - min),
  //   }));

  //   return Object.fromEntries(
  //     values.map(({ optionId, value }) => [optionId, value])
  //   );
  // });
}

interface UserScores {
  byCriterion: ByCriterion;
  byOption: ByOption;
  sorted: string[];
}

function sort(byOption: ByOption): string[] {
  return _.chain(byOption)
    .entries()
    .sortBy(1)
    .reverse()
    .map(([optionId]) => optionId)
    .value();
}

function getUserScores(criteria: Criterion[], ratings: Rating[]): UserScores {
  const criteriaScores = getCriteriaScores(criteria);
  const ratingsScores = getRatingsScores(ratings);

  const byCriterion = _.chain(criteria)
    .groupBy("id")
    .mapValues(([criterion], criterionId) => {
      const criterionRatings = ratingsScores[criterionId];
      const criterionScore = criteriaScores[criterionId];
      const byOption = _.chain(criterionRatings)
        .mapValues((optionScore) => criterionScore * optionScore)
        .value();
      return {
        byOption,
        criterion,
        sorted: sort(byOption),
      };
    })
    .value();

  // const byCriterion = _.mapValues(
  //   ratingsScores,
  //   (optionsScores, criterionId) => {
  //     const { score, criterion } = criteriaScores[criterionId];
  //     return {
  //       byOption: _.mapValues(optionsScores, (optionScore) => {
  //         return score * optionScore;
  //       }),
  //       criterion,
  //     };
  //   }
  // );

  const byOption = _.chain(ratings)
    .groupBy("optionId")
    .mapValues((ratings) => {
      return _.sumBy(ratings, ({ criterionId, optionId }) => {
        return byCriterion[criterionId].byOption[optionId];
      });
    })
    .value();

  return {
    byCriterion,
    byOption,
    sorted: sort(byOption),
  };
}

export function processResults(
  criteria: Criterion[],
  ratings: Rating[]
): Processed {
  const criteriaByUser = _.groupBy(criteria, "user.id");
  const ratingsByUser = _.groupBy(ratings, "user.id");
  const userCount = _.size(criteriaByUser);

  const byUser = _.mapValues(criteriaByUser, (criteria, userId) => {
    const ratings = ratingsByUser[userId];
    const { user } = criteria[0];
    return {
      ...getUserScores(criteria, ratings),
      user,
    };
  });

  const byOption: ByOption = {};
  for (const userResults of Object.values(byUser)) {
    for (const [optionId, value] of Object.entries(userResults.byOption)) {
      byOption[optionId] = byOption[optionId] || 0;
      byOption[optionId] += value / userCount;
    }
  }

  return {
    byOption,
    byUser,
  };
}
