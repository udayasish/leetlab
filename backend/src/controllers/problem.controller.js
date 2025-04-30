import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  //Going to get all the data from the request body
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  //Check the user role agin
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "You are not allowed to create a problem",
    });
  }

  for (let [language, solutionCode] of Object.entries(referenceSolutions)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId) {
      return res
        .status(400)
        .json({ error: `Language ${language} is not supported` });
    }

    const submissions = testcases.map(({ input, output }) => {
      return {
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      };
    });

    const submissionResult = await submitBatch(submissions);

    const tokens = submissionResult.map(({ res }) => res.token);

    const results = await pollBatchResults(tokens);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status_id !== 3) {
        return res
          .status(500)
          .json({ error: `Testcase ${i + 1} failed for language ${language}` });
      }
    }

    const newProblem = await db.problem.create({
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user.id,
    });

    return res.status(201).json(newProblem);
  }
  //Loop through each reference solution for different languages
};
export const getAllProblems = async () => {};
export const getProblemById = async () => {};
export const updateProblemById = async () => {};
export const deleteProblemById = async () => {};
export const getAllProblemsSolvedByUser = async () => {};
