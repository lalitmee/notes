import requests
import json

SENTRY_API_URL = 'https://sentry.io/api/0/projects/nysaa-web/nysaa-web/events/'
SENTRY_AUTH_TOKEN = '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'

headers = {
    'Authorization': f'Bearer {SENTRY_AUTH_TOKEN}',
    'Content-Type': 'application/json',
}

response = requests.get(SENTRY_API_URL, headers=headers)

if response.status_code == 200:
    events = response.json()
    # # Pretty print the JSON response
    # print(json.dumps(events, indent=4))

    console_logs = []
    console_titles = []
    for event in events:
        console_titles.append(event['title'])
        # if event['event.type'] == 'message':
        #     console_logs.append(event['message'])
    # print(console_logs)
    print(list(set(console_titles)))
else:
    print(f"Failed to retrieve events: {response.status_code}")
