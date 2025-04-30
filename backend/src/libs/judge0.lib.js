export const getJudge0LanguageId = (language) => {
  const languageMap = {
    Python: 71,
    Javascript: 63,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );

    const results = data.submissions;

    const isAllDone = results.every(
      (r) => r.status_id !== 1 && r.status_id !== 2
    );

    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch{?base64_encoded`,

    { submissions }
  );

  console.log(data);
  return data; // [{token}, {token}, {token}]
};
