---
title: COVID-19 and Climate - Computation Linguistics Final Project
category: project
tags: nlp python twitter-api research machine-learning school 
---

In Spring 2020, during my last semester at Vassar, I took CMPU366: Computational Linguistics. The class went over various tools and machine learning techniques used in natural language processing (NLP), and it culminated in a final months-long project where we would get to use the tools we'd learned about. 

Since the project started around the same time that COVID-19 was getting bad in the US, I decided to do something related to the pandemic. I had begun to notice a couple of climate-related ideas repeated over and over on platforms like Twitter:

- If we can make such swift, global change in response to COVID-19, can we do the same for climate change?
- Will the pandemic allow the planet to "heal" as humans stay mostly inside and emissions plateau?

I decided I would use my project to investigate whether these new topics reflect an overall shift in the way we talk about climate change as a result of COVID-19.

My results weren't extremely conclusive, and I don't believe I had nearly enough climate-related tweets to work with in the first place; however, going through the project was valuable in itself, and I learned a ton about working with tweets, using machine learning, data analysis, and much more. I used a bunch of new tools and libraries, including `scikit-learn`, `matplotlib`, `Tweepy`, Twitter API, `nltk`, and Jupyter Notebook. 

I'll explain a bit about the process of my project below, but you can see the full code and writeup at [this repository](https://gitlab.com/my-projects-sophiestephenson/school/computational-linguistics/final-project-the-impact-of-covid19-on-climate-discourse).


____

### Step 1: Planning

My first task was to figure out the best way to go about my investigation. I decided to focus on Twitter, since it would likely reflect public opinion and discussion better than any other corpora. I would gather a corpus of climate-related tweets from before COVID-19 began and after COVID-19 became a global emergency, then perform analysis on those tweets. I wanted to get answers to four specific questions:

1. What proportion of users was tweeting about climate change before and after COVID-19, and what topics were they tweeting about?
2. Has the ratio of climate "believer" tweets to climate "denier" tweets shifted since COVID-19?
3. Has the overall positive or negative sentiment of climate-related tweets changed?
4. Which climate topics have arisen since COVID-19 that weren't being discussed before the pandemic, and which topics have faded away?


### Step 2: Data collection

At least half of the work for this project was spent gathering and organizing data. The easiest option would have been to use the Twitter Standard Search API to look for tweets containing certain climate terms before and after COVID-19. However, this API only allows searches up to 7 days in the past, and the API options which go further back have extremely tight rate limits for free-tier users. As a workaround, I used [this paper](https://arxiv.org/abs/1603.04010) by Abbar et al. to guide my data gathering procedure. I took the following steps.

1. _Choose locations to focus on._ I chose five (English-speaking) cities highly affected by the virus: Seattle, Los Angeles, New York City, London, and Sydney. 
2. _Gather user lists from each location._ Using the Twitter Labs Filtered Stream API, I gathered a real-time stream of public tweets from each location. I saved the author IDs to a text file for each location, avoiding duplicates. I ended up gathering over 10,000 users each from NYC, LA, and London, and over 2,000 users each from Seattle and Sydney.
3. _Gather tweets from each user's timeline._ I used [Tweepy](http://docs.tweepy.org/en/latest/) to collect 400 tweets from each user's timeline. This yielded 2.8 million tweets from each of the larger cities and 550,000 from each smaller city.
4. _Split tweets by date._ Any tweet from before 2020 was labeled as "before COVID-19"; any tweet from after March 10, 2020 (the day the virus was declared a pandemic) was labeled as "after COVID-19". Tweets made in between those dates were ignored.
5. _Separate climate tweets._ I used the [UN Global Pulse Taxonomy of Climate Change Terms](http://www.unglobalpulse.net/climate/taxonomy/) to distinguish climate tweets. I also added some of my own terms to ensure I gathered a large corpus. This step yielded 14,500 climate-related tweets from before COVID-19 and 10,000 from after COVID-19 began.

There are a few issues with my data. Tweets longer than 140 characters were truncated by Tweepy; I was definitely picking up several non-climate related tweets with my set of terms; and I did not have nearly as many tweets as I had hoped to be able to work with. However, I'm still proud of the work I did to gather the dataset.

### Step 3: Believer/denier classification

For this step, I relied heavily on Andrew Graves' [article](https://towardsdatascience.com/classifying-climate-change-tweets-8245450a5e96) in Towards Data Science. I first hydrated 3 million climate tweets from the [Harvard Dataverse](https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/5QCCUU), separated out "definitive" believer and denier tweets based on a list of hashtags, and trained a Logistic Regression model with a CountVectorizer using the definitive tweets. I then used the trained model to classify my corpus into believer and denier tweets. 

The most informative features of the classifier are below -- a positive score means that the feature is likely to indicate a denier tweet. I felt most of them made sense, although "#climatechange #solar" being the most informative denier feature felt a bit suspect. 

![Image](/assets/images/believerdenier-most-inf.png){:width="90%"}

Running the classifier on my tweets did not yield any very informative results. There was no trend across the five locations; plus, among all tweets, the percentage of believer tweets went from 98.52% to 98.48%, essentially no change. 

![Image](/assets/images/believerdenier-percent-denier.png){:width="50%"}

### Step 4: Sentiment classification

This classifier required that I collect positive and negative tweets for training. I collected over 45,000 tweets by using the Filtered Stream V1 API to gather tweets which contained emojis such as :), :D, and :-(. I wrote a preprocessor to process the data, then trained a LinearSVM classifier with a TDIDF Vectorizer on the positive and negative tweets. Finally, I used the trained model to classify my corpus by sentiment.
 
Below are the most informative features for the sentiment classifier. Here, a positive score means the feature is likely to indicate positive sentiment.

![Image](/assets/images/sentiment-most-inf.png){:width="90%"}

As with the last classifier, I did not see any significant trends across time periods, except a slight trend towards negative tweets post-COVID-19; if this is significant at all, I would bet it has more to do with a general negative public sentiment due to the pandemic than it does with how people are talking about climate change specifically.

![Image](/assets/images/sentiment-percent-neg.png){:width="50%"}

### Step 5: Before/after COVID-19 classification

My last classifier tried to uncover which characteristics indicated a tweet was from before COVID-19, and which indicated the tweet came from after COVID-19. To do so, I loaded all of my climate tweets and used them to train and test an NLTK Naive Bayes classifier. Then, I looked at the classifier's most informative features to learn something about the differences between the two sets of tweets. 

I won't include the graph of the top 50 most informative features here, since it is quite large. You can find the graph in my final report in the project repository. Here are takeaways from those features, though:
- Some of the top features that leaned towards after COVID-19 began were "universal", "intl", and "airport". This could potentially indicate a rise in discussions about the global nature of both climate change and the pandemic and about the impact of air travel (and its present decline) on the climate.
- Several informative features were similar to "in this climate", "in this environment", "team environment", etc. These were likely misclassified as climate tweets during data collection, since clearly here "climate" and "environment" don't refer to climate change.
- "Biden" was also more frequently referenced after COVID-19, which more likely reflects the current political situation leading up to the November election rather than any change in climate discussion.

### Conclusions

I do feel a bit unsatisfied with the results of the project -- I think I could have learned much more with a greater volume of tweets to work with. It was certainly an interesting project, though, and I hope more work is done on this topic in the future. 

I hope you enjoyed learning about this project! Again, if you are interested in learning more or looking at the code, please check out my [respository](https://gitlab.com/my-projects-sophiestephenson/school/computational-linguistics/final-project-the-impact-of-covid19-on-climate-discourse).

_(This post was written in late October 2020, when I first created this website. However, I've dated it to when the project was finished: May 2020.)_
