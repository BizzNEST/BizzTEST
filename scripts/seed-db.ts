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
    type: 'file-upload' as const,
    question: `Project: Create a small digital flyer for a 'Community Bake Sale.'

Task: Design a digital flyer (e.g., A5 size or a standard social media post size like 1080x1080px) that clearly communicates the event details. Your design must include:

• A prominent title: "Community Bake Sale"
• Essential event details: Date, Time, and Location (you can invent these details, e.g., "Saturday, August 10th, 10 AM - 2 PM, Town Hall Auditorium")
• At least one relevant visual element (e.g., an icon of a cupcake, a simple illustration of baked goods, or a placeholder image if using Figma)

Constraints:
• Time Limit: 15-20 minutes
• Software: Canva OR Figma
• Deliverable: A screenshot of your completed digital flyer

Focus: Demonstrate basic understanding of readability, visual appeal, and effective use of chosen software's text, shape, and image tools.

Key Principles: Focus on clear hierarchy and effective use of space.`,
    points: 10,
    has_correct_answer: false,
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
  'Sample Test Quiz with File Upload',
  'A sample quiz with multiple question types including file upload for project-based assessment.',
  sampleQuestions
)

console.log(`Created sample quiz with ID: ${quizId}`) 