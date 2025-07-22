import { createQuiz } from '../lib/db'

const sampleQuestions = [
  {
    type: 'multiple-choice-single' as const,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correct_answer: '2', // Paris
    points: 2,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-multiple' as const,
    question: 'Which of the following are programming languages? (Select all that apply)',
    options: ['JavaScript', 'HTML', 'Python', 'CSS', 'Java'],
    correct_answer: '0,2,4', // JavaScript, Python, Java
    points: 3,
    has_correct_answer: true,
  },
  {
    type: 'true-false' as const,
    question: 'The Earth is flat.',
    correct_answer: 'false',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'short-answer' as const,
    question: 'What is 2 + 2?',
    correct_answer: '4',
    points: 1,
    has_correct_answer: true,
  },
  {
    type: 'multiple-choice-single' as const,
    question: 'What is your favorite programming language? (Open-ended)',
    options: ['JavaScript', 'Python', 'Java', 'C++', 'Other'],
    points: 1,
    has_correct_answer: false,
  },
  {
    type: 'true-false' as const,
    question: 'Do you enjoy learning new technologies? (Open-ended)',
    points: 1,
    has_correct_answer: false,
  },
  {
    type: 'short-answer' as const,
    question: 'Describe your ideal work environment in a few words. (Open-ended)',
    points: 2,
    has_correct_answer: false,
  },
]

const quizId = createQuiz(
  'Sample Test Quiz',
  'A sample quiz with multiple question types including both graded and open-ended questions.',
  sampleQuestions
)

console.log(`Created sample quiz with ID: ${quizId}`) 