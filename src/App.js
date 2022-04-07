import React, { useState } from 'react'
import './App.sass'
import db from './db.json'

const GROUP_ALL = 'all'
const GROUP_INCORRECT = 'incorrect'

export default function App() {
  const topics = [...new Set([].concat.apply([], db.map(({tag_names_only}) => tag_names_only)))]

  const [questions, setQuestions] = useState(db)
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const isCorrect = score => {
    return score === 1
  }

  const getFilteredQuestions = (topic, group) => {
    return db
      .filter(({tag_names_only}) => !topic || tag_names_only.indexOf(topic) !== -1)
      .filter(({scaled_score}) => group === GROUP_ALL || !isCorrect(scaled_score))
  }

  return <div className="app-holder">
    <h1 className="main-title">Question History</h1>

    <div className="filter-row">
      <div>
        <label>Filter By</label>
        <select value={selectedTopic} onChange={({ target }) => setSelectedTopic(target.value)}>
          <option value="">Choose Your Topics</option>
          {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>
      <button onClick={() => {
        setSelectedQuestion(null)
        setQuestions(getFilteredQuestions(selectedTopic, selectedGroup))
      }}>Filter Questions</button>
      <button onClick={() => {
        const newGroup = selectedGroup === GROUP_ALL ? GROUP_INCORRECT : GROUP_ALL
        setSelectedQuestion(null)
        setSelectedGroup(newGroup)
        setQuestions(getFilteredQuestions(selectedTopic, newGroup))
      }}>
        { selectedGroup === GROUP_ALL ? 'Show Incorrect Only' : 'Show All' }
      </button>
    </div>

    <div className="quiz-row">
      <div className="questions-col">
        <h2 className="main-title">
          Answered Questions: 
          ({ questions.length })
        </h2>

        <div className="questions-list">
          {questions.map(question => <div key={question.id} className="question-item">
            <div className="question-text" dangerouslySetInnerHTML={{ __html: question.question_text }}></div>
            <div>{isCorrect(question.scaled_score) ? 'Correct' : 'Incorrect'}</div>
            <button onClick={() => setSelectedQuestion(question)}>Answer</button>
          </div>)}
        </div>

        <button onClick={() => {
          setQuestions(db)
          setSelectedTopic('')
          setSelectedGroup(GROUP_ALL)
        }}>Reset</button>
      </div>

      <div className="lesson-col">
        <div className="answer-options">
          {selectedQuestion ? selectedQuestion.id : null}
        </div>
        <div 
          className="lesson-content" 
          dangerouslySetInnerHTML={{ __html: selectedQuestion ? selectedQuestion.explanation : null }}
        ></div>

        <button>View Lesson</button>
        <button>Want Help?</button>
      </div>
    </div>
  </div>
}
