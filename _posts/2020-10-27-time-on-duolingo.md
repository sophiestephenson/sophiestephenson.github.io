---
title: Time Spent on Duolingo - Python Script
category: project
tags: python scripting fun
---

Since November 2019, I have been learning Scottish Gaelic on Duolingo. I became interested in the language when I studied abroad in Scotland, but didn't decide to start learning it until I started watching [Outlander](https://www.imdb.com/title/tt3006802/). Earlier this year, I tried to find out how many hours I'd spent on Duolingo, but could not find that number anywhere. That's when I decided to write [this script](https://gitlab.com/my-projects-sophiestephenson/personal/time-spent-on-duolingo-script) to figure it out.

<!--more-->

Duolingo doesn't keep track of the hours each user has spent on the app. However, it does send out weekly progress report emails to frequent users. These emails include some stats about what the user has learned that week. An example is below.

![Image](/images/duolingo-progress-report.png){:width=50%}

Using these emails, we can approximate the time a user has spent on Duolingo. My script uses Python's `imap_tools` and `html` packages to read and parse these emails. First, we log into the mailbox using creds stored in a `.yaml` file. Then, we look through all folders and make a list of all messages from Duolingo with the subject "Your weekly progress report".

```python
# get credentials 
with open('emailcreds.yaml') as f:
    creds = yaml.load(f, Loader=yaml.FullLoader)

# set up mailbox
setup_mailbox = MailBox('imap.gmail.com')
print("Logging in ...")
setup_mailbox.login(creds['email'], creds['pass'])
folders = [folder['name'] for folder in setup_mailbox.folder.list() if "[Gmail]" not in folder['name']]
setup_mailbox.logout()

# get html of all duolingo weekly progress report messages in every folder
msgs = []
for folder in folders:
    if folder != "":
        print("Checking", folder, "...")
        mailbox = MailBox('imap.gmail.com')
        mailbox.login(creds['email'], creds['pass'], initial_folder=folder)
        fetch = mailbox.fetch(AND(from_="hello@duolingo.com", subject="Your weekly progress report"))
        msgs += [msg.html for msg in fetch]
mailbox.logout()
```

Then, we set up an HTML parser. For each email, we simply parse the HTML, find where the "Time Spent" element appears, and grab the amount of time spent that week. (Since we know where that element will be in the code every time, this isn't hard.) Then, we can combine the information from each email to get an approximate amount of time the user has spent on Duolingo.

```python
# calculate the total minutes spent by reading the messages
total_minutes = 0
for msg in msgs:
    # feed the message through the parser
    parser.feed(msg)

    # find the string representing the time spent
    # to do so, we find the position of the Time Spent label element, and the actual time spent
    #   information should be three spots over from the label
    if "Time Spent" not in parser.html_data: continue
    time_spent_label_index = parser.html_data.index("Time Spent")
    time_spent_string = parser.html_data[time_spent_label_index + 3]
    time_spent = datetime.strptime(time_spent_string, '%Hh %Mm')
    total_minutes += (60 * time_spent.hour) + time_spent.minute
```

At the end, we get the total time spent on Duolingo, as reported by these weekly emails. It's a rough estimate, but is still very informative - I found out that I've spent over 18 hours on Duolingo, enough to fully complete the Scottish Gaelic skills tree!

I had a good time with this short project, and I encourage you to go check out the [GitLab repository](https://gitlab.com/my-projects-sophiestephenson/personal/time-spent-on-duolingo-script.git) if you're interested in the script or if you want to use it yourself. Instructions are in the repository.

Thanks for reading! Tioraidh an-dràsta fhèin!

_Cover photo by [freestocks](https://unsplash.com/@freestocks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)_
