---
title: Truth or Drink (Terminal Version)
category: project
tags: fun python csv game
---

Have you ever been in a YouTube black hole and stumbled upon one of these videos?
<div>{%- include extensions/youtube.html id='WoGY_73GVGA' -%}</div>

Not only are the videos hilarious, but the game is also available for purchase! It's called [Truth or Drink](https://www.playtruthordrink.com/) and it's a raunchy card game that helps you get to know your friends (or whoever you choose to play with). 

I decided to buy the game a bit ago, and opted for the $7 PDF version instead of the $35 set of physical cards. However, this made game play a bit artificial - we didn't want to print all the cards (and I don't own a printer), so instead we each took turns choosing cards from the PDF. There wasn't really randomness involved, and it wasn't as fun.

That's where [this project](https://gitlab.com/my-projects-sophiestephenson/personal/truth-or-drink) comes in - I whipped up a terminal version of Truth or Drink that would randomly generate cards as if we were picking them from a physical deck.

_________

Most Truth or Drink cards have two questions on them. An example card is below.

![Image](/assets/images/truth-or-drink-card.png){:width="30%"})

There are some cards with one question, but I decided to ignore them because I don't love to play with those cards anyway. The cards also come in a few flavors: On The Rocks (classic), Extra Dirty (NSFW), Happy Hour (feel-good), Last Call (nothing to lose). Generally, you choose one of those types and only play with that deck. The only ones I ever play are On The Rocks and Extra Dirty, so those are the only ones I dealt with in this project.

The first step of my project was to transfer some Truth or Drink question cards into a python-readable format. The simplest method, which also happened to be very tedious, was to literally copy the questions from each card into a spreadsheet with two columns, then export that sheet as a CSV. I did that once for each deck.

After creating the CSV, I just had to write a simple script (`truthordrink.py`) to facilitate game play. It loads up whichever deck of cards the player wants to use and randomly "picks a card" from the set of questions until there are none left. And that's it! Simple and sweet. 

_______

The project lives in [this GitLab repository](https://gitlab.com/my-projects-sophiestephenson/personal/truth-or-drink). The CSV files aren't included in the repository - if you want to play, but don't want to recreate those CSVs yourself, send me proof that you bought the PDF and I'll share the CSVs with you:)

Thanks for reading! Let me know if you use my little program, I'd love to hear that it brought someone else joy, too.

_(This post was written in late October 2020, when I first created this website - however, I've dated it to when the project was finished: October 2, 2020.)_
