let wordPairs = [];
let correctAnswer = ""; // 正解の英単語
let correctPage = ""; // 正解のページ番号

// HTML要素の取得
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const resultContainer = document.getElementById("result");

// CSVファイルを読み込む
fetch("words.csv")
  .then(response => response.text())
  .then(csvText => {
    wordPairs = parseCSV(csvText);
    generateQuiz();
  })
  .catch(error => console.error("Error loading CSV:", error));

// CSVを解析する（英単語、日本語訳、ページ番号のペアを作成）
function parseCSV(csvText) {
  return csvText
    .trim()
    .split("\n")
    .map(line => {
      const [word, meaning, page] = line.split(",");
      return {
        word: word.trim(),
        meaning: meaning.trim(),
        page: page.trim(),
      };
    });
}

// クイズを生成する
function generateQuiz() {
  if (wordPairs.length < 4) {
    alert("単語が少なすぎます。CSVには少なくとも4つの単語を含めてください。");
    return;
  }

  // ランダムに4つのペアを選択
  const selectedPairs = [];
  while (selectedPairs.length < 4) {
    const randomIndex = Math.floor(Math.random() * wordPairs.length);
    if (!selectedPairs.includes(wordPairs[randomIndex])) {
      selectedPairs.push(wordPairs[randomIndex]);
    }
  }

  // 正解を選択肢からランダムに決定
  const correctIndex = Math.floor(Math.random() * 4);
  const correctPair = selectedPairs[correctIndex];
  correctAnswer = correctPair.word; // 正解の英単語を保存
  correctPage = correctPair.page; // 正解のページ番号を保存

  // 問題文を設定
  questionText.textContent = `「${correctPair.meaning}」はどれですか？`;

  // 選択肢を表示
  optionsContainer.innerHTML = ""; // 過去の選択肢をクリア
  selectedPairs.forEach((pair, index) => {
    const button = document.createElement("button");
    button.textContent = pair.word;
    button.onclick = () => checkAnswer(index === correctIndex);
    optionsContainer.appendChild(button);
  });
}

// 答えをチェックする
function checkAnswer(isCorrect) {
  if (isCorrect) {
    resultContainer.textContent = `Correct! 正解は「${correctAnswer}」です。問題番号：${correctPage}`;
    resultContainer.className = "result correct";
  } else {
    resultContainer.textContent = `Wrong. 正解は「${correctAnswer}」です。問題番号：${correctPage}ページ`;
    resultContainer.className = "result wrong";
  }

  // 次のクイズを生成（少し遅らせる）
  setTimeout(() => {
    resultContainer.textContent = "";
    resultContainer.className = "result";
    generateQuiz();
  }, 2000); // 2秒間結果を表示してから次の問題へ
}
