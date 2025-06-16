import React, { useState, useEffect } from "react"

function Questions() {
  const [submittedQuestions, setSubmittedQuestions] = useState([])
  const [data, setData] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submittedData, setSubmittedData] = useState([])
  const [randomizedQuestions, setRandomizedQuestions] = useState([])
  const [showAll, setShowAll] = useState(false)
  const questionsPerPage = 20
  const [allQuestions, setAllQuestions] = useState([]) // <-- Add this line


  const getRandomQuestions = () => {
    if (data.length < questionsPerPage) {
      setRandomizedQuestions(data.map((q, i) => ({ ...q, originalIndex: i })))
      setShowAll(true) // If fewer than 20, just show everything
      return
    }

    const shuffled = [...data]
      .map((q, i) => ({ ...q, originalIndex: i })) // Add original index
      .sort(() => Math.random() - 0.5) // Shuffle questions randomly
    setRandomizedQuestions(shuffled.slice(0, questionsPerPage))
    setShowAll(false) // Indicate we're in "randomized" mode
  }

    const showAllQuestions = () => {
    setData(allQuestions) // <-- Reset data to all questions
    setRandomizedQuestions(allQuestions.map((q, i) => ({ ...q, originalIndex: i })))
    setShowAll(true)
  }

  const fetchKapitelQuestions = kapitelNumber => {
    fetch("./questions.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const filteredQuestions = myJson.questions.filter(
          question => question.Kapitel === kapitelNumber
        )
        setData(filteredQuestions.map((q, i) => ({ ...q, originalIndex: i })))
        setRandomizedQuestions(
          filteredQuestions.map((q, i) => ({ ...q, originalIndex: i }))
        )
        setShowAll(true)
      })
      .catch(error => console.error("Error fetching data:", error))
  }

  const fetchKapitelOneQuestions = () => fetchKapitelQuestions(1)
  const fetchKapitelTwoQuestions = () => fetchKapitelQuestions(2)
  const fetchKapitelThreeQuestions = () => fetchKapitelQuestions(3)
  const fetchKapitelFourQuestions = () => fetchKapitelQuestions(4)
  const fetchKapitelFiveQuestions = () => fetchKapitelQuestions(5)
  const fetchKapitelSixQuestions = () => fetchKapitelQuestions(6)
  const fetchKapitelSevenQuestions = () => fetchKapitelQuestions(7)
  const fetchKapitelEightQuestions = () => fetchKapitelQuestions(8)
  const fetchKapitelNineQuestions = () => fetchKapitelQuestions(9)
  const fetchKapitelTenQuestions = () => fetchKapitelQuestions(10)

  const handleCheckboxChange = (questionIndex, answerIndex, e) => {
    const checked = e?.target?.checked ?? e // Fallback to `e` if it's directly a boolean
    if (typeof checked !== "boolean") {
      console.error("Unexpected value for checkbox change:", e)
      return
    }

    const originalIndex = randomizedQuestions[questionIndex].originalIndex // Map back to original index
    setSelectedAnswers(prev => ({
      ...prev,
      [originalIndex]: {
        ...prev[originalIndex],
        [answerIndex]: checked,
      },
    }))
  }

  const handleSubmit = questionIndex => {
    const originalIndex = randomizedQuestions[questionIndex].originalIndex // Map back to original index
    const selected = selectedAnswers[originalIndex] || {} // Get selected answers for this question
    const questionData = data[originalIndex] // Retrieve the correct question from data

    setSubmittedData(prev => [
      ...prev.filter(entry => entry.question.originalIndex !== originalIndex), // Avoid duplicates
      { question: questionData, selectedAnswers: selected },
    ])

    setSubmittedQuestions(prev =>
      prev.includes(originalIndex) ? prev : [...prev, originalIndex]
    ) // Avoid duplicate submissions

    console.log("Submitting Question:", questionData)
    console.log("Selected Answers:", selected)
  }

  const getAnswerClass = (questionIndex, answerIndex) => {
    const originalIndex = randomizedQuestions[questionIndex].originalIndex
    if (!submittedQuestions.includes(originalIndex)) {
      return "" // No styling before submission
    }

    const question = data[originalIndex]
    const isCorrect = question.answers[answerIndex].isCorrect
    const isSelected = selectedAnswers[originalIndex]?.[answerIndex]

    if (isSelected) {
      return isCorrect ? "correct-answer" : "incorrect-answer" // Green for correct, red for incorrect
    }

    if (!isSelected && isCorrect) {
      return "missed-correct-answer" // Blue for correct but unselected answers
    }

    return "" // No special styling for other unselected answers
  }

   const getData = () => {
    fetch("./questions.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(response => response.json())
      .then(myJson => {
        const questionsWithIndex = myJson.questions.map((q, i) => ({ ...q, originalIndex: i }))
        setData(questionsWithIndex)
        setAllQuestions(questionsWithIndex) // <-- Save all questions here
      })
      .catch(error => console.error("Error fetching data:", error))
  }

  useEffect(() => {
    getData()
  }, [])

  const isSubmitDisabled = index => {
    const originalIndex = randomizedQuestions[index].originalIndex
    return !Object.values(selectedAnswers[originalIndex] || {}).includes(true)
  }

  const kapitelButtons = Array.from({ length: 10 }, (_, i) => ({
    label: `Get Kapitel ${i + 1} Questions`,
    onClick: () => fetchKapitelQuestions(i + 1),
  }))

  return (
    <div>
      <div className="button-container">
        <button onClick={getRandomQuestions} className="custom-button">
          Get Random Questions
        </button>
        <button onClick={showAllQuestions} className="custom-button">
          Show All Questions
        </button>
        {kapitelButtons.map((btn, idx) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="custom-button"
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div className="cards-container">
        {randomizedQuestions.length > 0 &&
          randomizedQuestions.map((question, index) => (
            <div className="card" key={index}>
              <h2>{question.question}</h2>
              <p1>({question.correctAnswersCount})</p1>
              <div className="answers-container">
                {question.answers.map((answer, i) => (
                  <div key={i} className={`answer ${getAnswerClass(index, i)}`}>
                    <input
                      type="checkbox"
                      id={`answer-${index}-${i}`}
                      aria-label={`Answer option ${i + 1}`}
                      disabled={submittedQuestions.includes(
                        randomizedQuestions[index].originalIndex
                      )}
                      checked={
                        selectedAnswers[
                          randomizedQuestions[index].originalIndex
                        ]?.[i] || false
                      }
                      onChange={e =>
                        handleCheckboxChange(index, i, e)
                      }
                    />
                    <label htmlFor={`answer-${index}-${i}`}>
                      {answer.text}
                    </label>
                  </div>
                ))}
              </div>
              <div className="submit-button-container">
                <button
                  className="submit-button"
                  onClick={() => handleSubmit(index)}
                  disabled={
                    submittedQuestions.includes(
                      randomizedQuestions[index].originalIndex
                    ) || isSubmitDisabled(index)
                  }
                >
                  {submittedQuestions.includes(
                    randomizedQuestions[index].originalIndex
                  )
                    ? "Answer Submitted"
                    : "Submit"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Questions
