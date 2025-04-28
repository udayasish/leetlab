import { db } from "../libs/db.js";

export const createProblem = async () => {
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

  //Loop through each reference solution for different languages
};
export const getAllProblems = async () => {};
export const getProblemById = async () => {};
export const updateProblemById = async () => {};
export const deleteProblemById = async () => {};
export const getAllProblemsSolvedByUser = async () => {};
