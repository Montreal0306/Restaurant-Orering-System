###from openai import OpenAI
#
#client = OpenAI(
#  api_key="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"
#)

#completion = client.chat.completions.create(
#  model="gpt-4o-mini",
#  store=True,
#  messages=[
#    {"role": "user", "content": "write a haiku about ai"}
#  ]
#  

import openai
import os

openai.api_key = os.getenv("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")

def chat_with_gpt(messages, model="gpt-4o", temperature=0.7):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature
    )
    return response.choices[0].message.content.strip()

def main():
    print("Chatbot is ready. Type 'quit' to exit.")
    messages = [{"role": "system", "content": "You are a helpful and friendly assistant."}]

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Goodbye!")
            break

        messages.append({"role": "user", "content": user_input})
        response = chat_with_gpt(messages)
        messages.append({"role": "assistant", "content": response})

        print("Chatbot:", response)

if __name__ == "__main__":
    main()
