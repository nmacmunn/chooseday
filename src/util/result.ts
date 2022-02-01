import { Result } from "../model/result";
import { ResultBuilder } from "../model/result-builder";
import { ResultPreprocessor } from "../model/result-preprocessor";
import type { AppContext } from "../types/context";

export function getResult({
  criteria,
  decision,
  options,
  ratings,
  user,
}: AppContext): Result | undefined {
  if (!options || !criteria || !ratings || !decision || !user) {
    return;
  }

  const preprocessor = new ResultPreprocessor(options, criteria, ratings);
  const readyUsers = preprocessor.getUsers();
  const readyCriteria = preprocessor.getCriteria(readyUsers);
  const readyRatings = preprocessor.getRatings(readyCriteria);

  const builder = new ResultBuilder(
    options,
    readyUsers,
    readyCriteria,
    readyRatings
  );
  const criterionResults = builder.getCriterionResults();
  const userResults = builder.getUserResults(criterionResults);
  const optionResults = builder.getOptionResults(userResults);

  return new Result(
    user,
    decision,
    criterionResults,
    userResults,
    optionResults
  );
}
