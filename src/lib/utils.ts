import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseApiMessage(apiMessage: Message): ParsedMessage[] {
  try {
    // The message format uses curly braces instead of square brackets
    // We need to convert it to a proper JSON array format
    let messageString = apiMessage.message;

    // Replace the outer curly braces with square brackets to make it a valid JSON array
    if (messageString.startsWith("{") && messageString.endsWith("}")) {
      messageString = messageString.replace(/^\{/, "[").replace(/\}$/, "]");
    }

    const parsedData = JSON.parse(messageString);
    const userMessage = parsedData[0];
    const aiResponse = parsedData[1];

    const parsedMessages: ParsedMessage[] = [];

    if (userMessage) {
      parsedMessages.push({
        id: apiMessage.id * 2 - 1,
        role: "user",
        content: userMessage,
        createdAt: new Date().toISOString(),
      });
    }

    if (aiResponse) {
      // Check if aiResponse is a string that needs to be parsed
      let chatContent = null;
      if (typeof aiResponse === "string") {
        try {
          const parsedAiResponse = JSON.parse(aiResponse);
          chatContent = parsedAiResponse.chat;
        } catch (_e) {
          chatContent = aiResponse;
        }
      } else if (aiResponse.chat) {
        chatContent = aiResponse.chat;
      }

      if (chatContent) {
        parsedMessages.push({
          id: apiMessage.id * 2,
          role: "assistant",
          content: chatContent,
          createdAt: new Date().toISOString(),
        });
      }
    }

    return parsedMessages;
  } catch (_error) {
    return [];
  }
}
