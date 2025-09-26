export interface WebhookRequest {
  id: string;
  content: string;
  company_id: string;
}

export interface WebhookResponse {
  success: boolean;
  data?: Array<{
    output: {
      cvf: number;
      chat: string;
      risks: number;
      schein: number;
      strengths: number;
      overall_score: number;
    };
  }>;
  error?: string;
}

export const callWebhook = async (id: string, content: string, company_id: string): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Webhook URL not configured");
  }

  const requestBody: WebhookRequest = {
    id,
    content,
    company_id,
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
