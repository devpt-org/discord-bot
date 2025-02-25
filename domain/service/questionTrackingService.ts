export default class QuestionTrackingService {
  private pendingQuestions: Map<string, string> = new Map(); // userId -> questionId

  hasPendingQuestion(userId: string): boolean {
    return this.pendingQuestions.has(userId);
  }

  trackQuestion(userId: string, questionId: string): void {
    this.pendingQuestions.set(userId, questionId);
  }

  removeQuestion(userId: string): void {
    this.pendingQuestions.delete(userId);
  }

  getQuestionId(userId: string): string | undefined {
    return this.pendingQuestions.get(userId);
  }
}
