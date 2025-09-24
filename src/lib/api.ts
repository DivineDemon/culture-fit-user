export interface WebhookRequest {
  messages: Message[];
  currentMessage: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: {
    output: string;
  };
  error?: string;
}

export const callWebhook = async (messages: Message[], currentMessage: string): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Webhook URL not configured");
  }

  const requestBody: WebhookRequest = {
    messages,
    currentMessage,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get response",
    };
  }
};
