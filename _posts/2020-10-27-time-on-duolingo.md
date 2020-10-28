---
title: Time Spent on Duolingo - Python Script
category: project
tags: python scripting fun
mode: immersive
header: 
  theme: light
article_header:
  type: cover
  image:
    src: /images/duolingo-header.jpg
---

Since November 2019, I have been learning Scottish Gaelic on Duolingo. I became interested in the language when I studied abroad in Scotland, but didn't decide to start learning it until I started watching [Outlander](https://www.imdb.com/title/tt3006802/). Earlier this year, I tried to find out how many hours I'd spent on Duolingo, but could not find that number anywhere. That's when I decided to write [this script](https://gitlab.com/my-projects-sophiestephenson/personal/time-spent-on-duolingo-script) to figure it out.

<!--more-->

Duolingo doesn't keep track of the hours each user has spent on the app. However, it does send out weekly progress report emails to frequent users. These emails include some stats about what the user has learned that week. An example is below.

![Image](/images/duolingo-progress-report.png){:width=50%}

Using these emails, we can approximate the time a user has spent on Duolingo. For each email, we need to simply parse the HTML, find where the "Time Spent" element appears, and grab the amount of time spent that week. Then, we can combine the information from each email to get an approximate amount of time the user has spent on Duolingo.

It's a rough estimate, but is still very informative - I found out that I've spent over 18 hours on Duolingo, enough to fully complete the Scottish Gaelic skills tree!

I had a good time with this short project, and I encourage you to go check out the [GitHub repository](https://gitlab.com/my-projects-sophiestephenson/personal/time-spent-on-duolingo-script.git) if you're interested in the script or if you want to use it yourself. Instructions are in the repository.

Thanks for reading! Tioraidh an-dràsta fhèin!

_Cover photo by [freestocks](https://unsplash.com/@freestocks?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/time?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)_
