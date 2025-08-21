# CSV Export Features

This document describes the CSV export functionality implemented for quiz results.

## Overview

The system now supports exporting quiz results in CSV format with multiple export options:

1. **Individual Submission Export** - Detailed results for a single student
2. **Bulk Export** - All submissions in a consolidated format
3. **Summary Export** - Statistical summary by quiz
4. **Quiz-Specific Export** - Results for a specific quiz only

## Export Types

### 1. Individual Submission Export
- **Location**: Individual submission detail view
- **Button**: "Export This Result" button
- **Format**: One row per question with detailed breakdown
- **Data**: Student info, question text, student answers, correct answers, scoring

**CSV Columns:**
- Student Name
- Student Email
- Quiz Name
- Submission Date
- Question Number
- Question Type
- Question Text
- Student Answer
- Correct Answer
- Points Earned
- Total Points
- Is Correct

### 2. Bulk Export (All Results)
- **Location**: Main results page
- **Button**: "Export All Results" button
- **Format**: One row per submission with aggregated data
- **Data**: Summary of all student submissions

**CSV Columns:**
- Student Name
- Student Email
- Quiz Name
- Submission Date
- Total Score
- Total Points
- Percentage
- Questions Correct
- Total Questions
- Time Taken (minutes)

### 3. Summary Export
- **Location**: Main results page
- **Button**: "Export Summary" button
- **Format**: One row per quiz with statistics
- **Data**: Aggregated performance metrics by quiz

**CSV Columns:**
- Quiz Name
- Total Submissions
- Average Score (%)
- Highest Score (%)
- Lowest Score (%)
- Perfect Scores
- Passing Rate (70%+)

### 4. Quiz-Specific Export
- **Location**: Individual submission detail view
- **Button**: "Export Quiz Results" button
- **Format**: Results for a specific quiz only
- **Data**: All submissions for the selected quiz

## API Endpoints

### Individual Submission Export
```
GET /api/export/submission/[id]
```

### All Submissions Export
```
GET /api/export/all?format=bulk|summary
```

### Quiz-Specific Export
```
GET /api/export/quiz/[quizId]
```

## User Experience Features

### Loading States
- Export buttons show loading spinners during export
- Buttons are disabled while any export is in progress
- Clear visual feedback for user actions

### Toast Notifications
- Success messages when exports complete
- Error messages when exports fail
- Auto-hide after 5 seconds
- Manual dismiss option

### File Naming
- Automatic timestamp inclusion
- Descriptive filenames based on export type
- Safe filename generation (removes special characters)

## Technical Implementation

### Backend
- **CSV Generation**: Native JavaScript/Node.js implementation
- **Data Processing**: Handles all question types and answer formats
- **Error Handling**: Comprehensive error handling and validation
- **Performance**: Efficient data processing for large datasets

### Frontend
- **Export Functions**: Async functions with proper error handling
- **State Management**: Loading states and user feedback
- **File Download**: Browser-native download functionality
- **Responsive Design**: Works on all device sizes

### Data Handling
- **Special Characters**: Proper CSV escaping for commas, quotes, newlines
- **Question Types**: Support for all question types (multiple choice, code, file upload, etc.)
- **Answer Formats**: Handles various answer formats and lengths
- **Date Formatting**: Consistent date formatting across exports

## Usage Examples

### Export a Single Student's Result
1. Navigate to the Results page
2. Click "View Details" on any submission
3. Click "Export This Result" button
4. CSV file downloads automatically

### Export All Results
1. Navigate to the Results page
2. Click "Export All Results" button
3. Choose between detailed or summary format
4. CSV file downloads automatically

### Export Quiz-Specific Results
1. View any individual submission
2. Click "Export Quiz Results" button
3. CSV file downloads with results for that specific quiz

## File Formats

All exports generate standard CSV files that can be opened in:
- Microsoft Excel
- Google Sheets
- Numbers (Mac)
- Any text editor
- Database import tools

## Error Handling

The system handles various error scenarios:
- Network failures
- Invalid submission IDs
- Missing quiz data
- Database connection issues
- File generation errors

Users receive clear error messages and can retry failed exports.

## Future Enhancements

Potential improvements for future versions:
- Excel (.xlsx) format support
- Scheduled exports
- Email delivery of exports
- Custom export templates
- Advanced filtering options
- Export history tracking 