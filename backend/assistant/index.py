import json
import os
import urllib.request

def handler(event: dict, context) -> dict:
    """Чат-помощник работника — отвечает на вопросы через OpenAI GPT."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])

    system_prompt = {
        "role": "system",
        "content": (
            "Ты — умный помощник для работника сервисной компании. "
            "Помогаешь составлять тексты клиентам, отвечаешь на вопросы по работе, "
            "помогаешь рассчитать стоимость, подобрать формулировки, составить объяснение или отказ. "
            "Отвечай кратко, по делу, на русском языке."
        )
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": [system_prompt] + messages,
        "max_tokens": 1000,
        "temperature": 0.7
    }

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"
        },
        method="POST"
    )

    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    reply = result["choices"][0]["message"]["content"]

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"reply": reply}, ensure_ascii=False)
    }
