import { English } from "../Shared/Data";

export class CompletionApi {
  static getCompletion(authorization: string, text: string, lang: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let request: any = {
        model: 'text-davinci-003',
        temperature: 0.1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        prompt: text,
      };

      if (lang != English) {
        request = {
          ...request,
          stop: '```',
          prompt: "```" + lang + "\n" + text,
        }
      }

      fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authorization}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      .then(response => response.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
    });
  }
}