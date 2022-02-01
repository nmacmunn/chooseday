import _ from "lodash";
import type {
  CriterionId,
  CriterionResult,
  OptionResult,
  OverallScore,
  UserId,
  UserResult,
} from "../types/result";
import type { Criterion, Decision, Option, User } from "../types/data";
import { getName, getNames, getPossessive } from "../util/name";

interface Dataset {
  data: number[];
  label: string;
}

function topIn<T extends { results: OptionResult<number>[] | undefined }>(
  option: Option,
  results: T[]
): T[] {
  return _.filter(
    results,
    ({ results }) => !!_.find(results, { rank: 1, id: option.id })
  );
}

export class Result {
  private criterionResultsByUserId: Record<UserId, CriterionResult[]>;
  private criterionResultsById: Record<CriterionId, CriterionResult>;
  private userResultsById: Record<UserId, UserResult>;
  constructor(
    private user: User,
    private decision: Decision,
    private criterionResults: CriterionResult[],
    private userResults: UserResult[],
    private optionResults: OptionResult<OverallScore>[]
  ) {
    this.userResultsById = _.keyBy(userResults, "id");
    this.criterionResultsById = _.keyBy(criterionResults, "id");
    this.criterionResultsByUserId = _.groupBy(criterionResults, "user.id");
  }

  /**
   * Has the user rated at least one option differently from the others for
   * the specified criterion?
   */
  criterionIsDone({ id }: Criterion): boolean {
    const criterionResult = this.criterionResultsById[id];
    return !!(criterionResult && criterionResult.results);
  }

  /**
   * Get chart datasets for criteria belonging to the specified user.
   */
  getCriterionDatasets(user: User): Dataset[] {
    const criterionResults = this.criterionResultsByUserId[user.id];
    if (!criterionResults) {
      return [];
    }
    return criterionResults.map((criterionResult) => {
      const data = _(criterionResult.results).sortBy("id").map("score").value();
      const label = criterionResult.title;
      return { data, label };
    });
  }

  getDoneUsers() {
    return _.filter(this.userResults, ({ results }) => !!results);
  }

  /**
   * Get chart datasets for each users.
   */
  getUserDatasets(): Dataset[] {
    return this.getDoneUsers().map((userResult) => {
      const data = _(userResult.results).sortBy("id").map("score").value();
      const label = getName(userResult, this.user, this.decision);
      return { data, label };
    });
  }

  /**
   * Get a description of the specified option in the context of the overall
   * result.
   */
  getOverallOptionDescription(option: Option): string {
    const topChoices = topIn(option, this.userResults);
    const [first] = topChoices;
    if (!first) {
      return "";
    }
    if (topChoices.length === 1) {
      const possessive = getPossessive(first, this.user, this.decision, true);
      return `${possessive} top choice`;
    }
    return `Top choice of ${getNames(topChoices, this.user, this.decision)}`;
  }

  /**
   * Get a description of the specified option in the context of the specified
   * user.
   */
  getUserOptionDescription(option: Option, { id }: User): string {
    const criterionResults = this.criterionResultsByUserId[id];
    if (!criterionResults) {
      return "";
    }
    const top = topIn(option, criterionResults);
    const bestFor = _.map(top, "title");
    if (bestFor.length) {
      return `Best for ${bestFor.join(", ")}`;
    }
    return "";
  }

  /**
   * Get the specified user's results for each option.
   */
  getUser(user: User): OptionResult<OverallScore>[] {
    const userResult = this.userResultsById[user.id];
    return (userResult && userResult.results) || [];
  }

  /**
   * Get the overall results for each option.
   */
  getOverall(): OptionResult<OverallScore>[] {
    return this.optionResults;
  }

  /**
   * Does the specified user have results? Must have at least two criteria
   * and all options must be ranked for each.
   */
  userIsDone({ id }: User): boolean {
    const userResult = this.userResultsById[id];
    return !!(userResult && userResult.results);
  }
}
