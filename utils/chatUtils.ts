export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

/**
 * Generates a response to a user message
 * In a real implementation, this would:
 * 1. Convert the message to an embedding
 * 2. Query the vector database for relevant context
 * 3. Pass the context and question to a language model
 * 4. Return the generated answer
 */
export async function generateResponse(message: string, hasDocument: boolean): Promise<string> {
  // In a real app, this would use langchain or similar to query the RAG system
  
  // For demo purposes, we'll return mock responses
  const lowerMessage = message.toLowerCase();
  
  // If no document is loaded, inform the user
  if (!hasDocument) {
    return "I don't have the university handbook loaded yet. Please upload the handbook PDF in the Settings tab to get accurate information.";
  }
  
  // Simulate RAG responses for common questions
  if (lowerMessage.includes('admission') || lowerMessage.includes('enroll')) {
    return "According to the NU Dasmarinas handbook, admission requirements include submission of entrance exam results, previous academic records, and a completed application form. Enrollment periods typically occur in June and November for regular semesters, with a summer term available in April.";
  }
  
  if (lowerMessage.includes('tuition') || lowerMessage.includes('fee')) {
    return "Based on the handbook, NU Dasmarinas' tuition and fees vary by program. The university offers various payment schemes including full payment, installment plans, and student loans. For specific amounts, please consult the latest fee structure from the Accounting Office. The handbook also mentions scholarship opportunities for qualified students.";
  }
  
  if (lowerMessage.includes('schedule') || lowerMessage.includes('class hours')) {
    return "According to the handbook, regular classes at NU Dasmarinas run from Monday to Saturday. Weekday classes typically start at 7:00 AM and end by 9:00 PM, while Saturday classes end by 6:00 PM. Each course session lasts for 1.5 hours with a 30-minute break between sessions.";
  }
  
  if (lowerMessage.includes('uniform') || lowerMessage.includes('dress code')) {
    return "The handbook states that NU Dasmarinas requires students to wear the prescribed university uniform during weekdays. Business casual attire is permitted on designated days. The proper uniform consists of the official university polo/blouse with the NU logo, prescribed pants/skirt, and closed black shoes.";
  }
  
  if (lowerMessage.includes('calendar') || lowerMessage.includes('academic year')) {
    return "The NU Dasmarinas academic year consists of two regular semesters (approximately 18 weeks each) and an optional summer term (approximately 6 weeks). The first semester typically runs from August to December, the second from January to May, and summer classes from June to July.";
  }
  
  if (lowerMessage.includes('facility') || lowerMessage.includes('campus')) {
    return "According to the handbook, NU Dasmarinas facilities include modern classrooms, specialized laboratories, a comprehensive library, sports facilities, a student center, food court, clinic, and prayer rooms. All buildings are equipped with WiFi access, and the campus has 24/7 security.";
  }
  
  if (lowerMessage.includes('graduation') || lowerMessage.includes('requirements')) {
    return "The handbook outlines that to graduate from NU Dasmarinas, students must complete all required courses in their curriculum, maintain the minimum GPA requirement for their program, pass comprehensive exams or complete a thesis/capstone project (program-dependent), and have no outstanding financial or administrative obligations.";
  }
  
  // Generic response for other queries
  return "Based on the university handbook, I can help with information about NU Dasmarinas policies, procedures, academic programs, facilities, and student services. Could you please be more specific about what information you're looking for?";
}