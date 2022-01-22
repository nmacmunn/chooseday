import type { Criterion, Decision, Option, Rating, User } from "../types/data";
import _ from "lodash";
import { getNames, getPossessive } from "./name";
import type { ResultsContext } from "../types/context";

type CriterionId = string & {};
type OptionId = string & {};
type UserId = string & {};

type Ranked = {
  rank: number;
  options: Option[];
};

type ByOption = Record<OptionId, number>;

type ByCriterion = Record<
  CriterionId,
  {
    byOption: ByOption;
    criterion: Criterion;
    sorted: Ranked[];
  }
>;

type ByUser = Record<
  UserId,
  {
    byCriterion: ByCriterion;
    byOption: ByOption;
    contribution: ByOption;
    sorted: Ranked[];
    user: User;
  }
>;

export interface Processed {
  byOption: ByOption;
  // byCriterion: ByCriterion;
  byUser: ByUser;
  sorted: Ranked[];
}

interface UserScores {
  byCriterion: ByCriterion;
  byOption: ByOption;
  sorted: Ranked[];
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
    .mapValues((criterionRatings) => {
      const weights = _.map(criterionRatings, "weight");
      const max = Math.max(...weights);
      const min = Math.min(...weights);
      return _.chain(criterionRatings)
        .groupBy("optionId")
        .mapValues(([{ weight }]) => (weight - min) / (max - min))
        .value();
    })
    .value();
}

function sort(options: Option[], byOption: ByOption): Ranked[] {
  const sorted = [...options].sort((a, b) => byOption[b.id] - byOption[a.id]);
  let ranked = [];
  let lastScore = undefined;
  for (let i = 0; i < sorted.length; i++) {
    const option = sorted[i];
    const score = byOption[option.id];
    if (score !== lastScore) {
      ranked.push({
        rank: i + 1,
        options: [option],
      });
      lastScore = score;
    } else {
      ranked[ranked.length - 1].options.push(option);
    }
  }
  return ranked;
}

function getUserScores(
  criteria: Criterion[],
  options: Option[],
  ratings: Rating[]
): UserScores {
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
        sorted: sort(options, byOption),
      };
    })
    .value();

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
    sorted: sort(options, byOption),
  };
}

export function getOptionDescription(
  option: Option,
  byUser: ByUser,
  currentUser: User,
  decision: Decision
) {
  const topChoiceOf = _.chain(byUser)
    .values()
    .filter(({ sorted }) => _.includes(sorted[0].options, option))
    .map(({ user }) => user)
    .value();
  if (topChoiceOf.length === 0) {
    return "";
  }
  if (topChoiceOf.length === 1) {
    return `${getPossessive(
      topChoiceOf[0],
      currentUser,
      decision,
      true
    )} top choice`;
  }
  return `Top choice of ${getNames(topChoiceOf, currentUser, decision)}`;
}

export function processResults(context: ResultsContext): Processed {
  const { criteria, options, ratings } = context;
  const criteriaByUser = _.groupBy(criteria, "user.id");
  const ratingsByUser = _.groupBy(ratings, "user.id");
  const userCount = _.size(criteriaByUser);

  const byUser = _.mapValues(criteriaByUser, (criteria, userId) => {
    const ratings = ratingsByUser[userId];
    const { user } = criteria[0];
    const userScores = getUserScores(criteria, options, ratings);
    const contribution = _.mapValues(userScores.byOption, (v) => v / userCount);
    return {
      ...userScores,
      contribution,
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
    sorted: sort(options, byOption),
  };
}
