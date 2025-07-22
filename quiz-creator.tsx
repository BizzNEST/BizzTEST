"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"

type QuestionType = "multiple-choice" | "true-false" | "short-answer"

interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
}

interface Quiz {
  name: string
  description: string
  questions: Question[]
}

export default function Component() {
  const [quiz, setQuiz] = useState<Quiz>({
    name: "",
    description: "",
    questions: [],
  })

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    }
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestion = (id: string) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }))
  }

  const updateQuestionType = (id: string, type: QuestionType) => {
    const updates: Partial<Question> = { type }

    if (type === "multiple-choice") {
      updates.options = ["", "", "", ""]
      updates.correctAnswer = ""
    } else if (type === "true-false") {
      updates.options = undefined
      updates.correctAnswer = ""
    } else {
      updates.options = undefined
      updates.correctAnswer = ""
    }

    updateQuestion(id, updates)
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question && question.options) {
      const newOptions = [...question.options]
      newOptions[optionIndex] = value
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const addOption = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question && question.options) {
      updateQuestion(questionId, { options: [...question.options, ""] })
    }
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question && question.options && question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const renderQuestionEditor = (question: Question, index: number) => {
    return (
      <Card key={question.id} className="relative">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {question.points} {question.points === 1 ? "point" : "points"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQuestion(question.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor={`question-${question.id}`}>Question</Label>
              <Textarea
                id={`question-${question.id}`}
                placeholder="Enter your question here..."
                value={question.question}
                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) => updateQuestionType(question.id, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <Label htmlFor={`points-${question.id}`} className="text-sm">
                  Points
                </Label>
                <Input
                  id={`points-${question.id}`}
                  type="number"
                  min="1"
                  value={question.points}
                  onChange={(e) => updateQuestion(question.id, { points: Number.parseInt(e.target.value) || 1 })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {question.type === "multiple-choice" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => addOption(question.id)}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Option
                </Button>
              </div>
              <RadioGroup
                value={question.correctAnswer as string}
                onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
              >
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-option-${optionIndex}`} />
                    <Input
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                      className="flex-1"
                    />
                    {question.options && question.options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(question.id, optionIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-muted-foreground">Select the radio button next to the correct answer</p>
            </div>
          )}

          {question.type === "true-false" && (
            <div className="space-y-3">
              <Label>Correct Answer</Label>
              <RadioGroup
                value={question.correctAnswer as string}
                onValueChange={(value) => updateQuestion(question.id, { correctAnswer: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`${question.id}-true`} />
                  <Label htmlFor={`${question.id}-true`}>True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`${question.id}-false`} />
                  <Label htmlFor={`${question.id}-false`}>False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {question.type === "short-answer" && (
            <div className="space-y-3">
              <Label htmlFor={`answer-${question.id}`}>Expected Answer (Optional)</Label>
              <Input
                id={`answer-${question.id}`}
                placeholder="Leave blank for open-ended questions"
                value={(question.correctAnswer as string) || ""}
                onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              />
              <p className="text-sm text-muted-foreground">
                If left blank, this will be treated as an open-ended question requiring manual grading
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
          <p className="text-muted-foreground">Design your quiz with multiple question types</p>
        </div>
        <Button size="lg" className="bg-green-600 hover:bg-green-700">
          Publish Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription>Basic details about your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quiz-name">Quiz Name</Label>
            <Input
              id="quiz-name"
              placeholder="Enter quiz name..."
              value={quiz.name}
              onChange={(e) => setQuiz((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="quiz-description">Description</Label>
            <Textarea
              id="quiz-description"
              placeholder="Describe what this quiz covers..."
              value={quiz.description}
              onChange={(e) => setQuiz((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Questions</h2>
            <p className="text-muted-foreground">
              {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} •{" "}
              {quiz.questions.reduce((sum, q) => sum + q.points, 0)} total points
            </p>
          </div>
          <Button onClick={addQuestion}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>

        {quiz.questions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">No questions yet</h3>
                <p className="text-muted-foreground">Click "Add Question" to get started</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => renderQuestionEditor(question, index))}
          </div>
        )}
      </div>

      {quiz.questions.length > 0 && (
        <div className="flex justify-end pt-6 border-t">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Publish Quiz
          </Button>
        </div>
      )}
    </div>
  )
}
