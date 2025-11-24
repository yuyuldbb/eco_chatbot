from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# IMPORTANT: Put your OpenAI API key here
client = OpenAI(api_key="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")


@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_msg = data.get("message", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI expert in Nuclear Energy, Green Environment, and Waste Management."},
            {"role": "user", "content": user_msg}
        ]
    )

    ai_reply = response.choices[0].message.content


    return jsonify({"reply": ai_reply})


if __name__ == '__main__':
    app.run(port=7860, debug=True)
